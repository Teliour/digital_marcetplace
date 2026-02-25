"use server"

import { createClient } from "@/lib/supabase/server"

export type Order = {
  id: string
  buyer_id: string
  product_id: string
  seller_id: string
  customer_data: string
  amount: number
  escrow_amount: number
  status: "pending" | "completed" | "cancelled"
  created_at: string
  product?: {
    title: string
    image_url: string
  }
}

// --- Balance ---

export async function getBalance(userId: string): Promise<number> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .single()

  if (error || !data) {
    console.error("[v0] Error fetching balance:", error)
    return 0
  }
  return data.balance ?? 0
}

// --- Purchase with escrow ---

export async function purchaseProduct(params: {
  buyer_id: string
  product_id: string
  seller_id: string
  customer_data: string
  amount: number
}): Promise<{ success: boolean; error?: string; order?: Order }> {
  const supabase = await createClient()

  // 1. Check buyer balance
  const { data: buyer, error: buyerError } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", params.buyer_id)
    .single()

  if (buyerError || !buyer) {
    return { success: false, error: "Не удалось получить данные покупателя" }
  }

  if (buyer.balance < params.amount) {
    return { success: false, error: `Недостаточно средств. Ваш баланс: ${buyer.balance} ₽, нужно: ${params.amount} ₽` }
  }

  // 2. Deduct from buyer balance
  const { error: deductError } = await supabase
    .from("profiles")
    .update({ balance: buyer.balance - params.amount })
    .eq("id", params.buyer_id)

  if (deductError) {
    console.error("[v0] Error deducting balance:", deductError)
    return { success: false, error: "Ошибка списания средств" }
  }

  // 3. Create order with escrow
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      buyer_id: params.buyer_id,
      product_id: params.product_id,
      seller_id: params.seller_id,
      customer_data: params.customer_data,
      amount: params.amount,
      escrow_amount: params.amount,
      status: "pending",
    }])
    .select()
    .single()

  if (orderError) {
    // Rollback: return money to buyer
    await supabase
      .from("profiles")
      .update({ balance: buyer.balance })
      .eq("id", params.buyer_id)

    console.error("[v0] Error creating order:", orderError)
    return { success: false, error: "Ошибка создания заказа: " + orderError.message }
  }

  // 4. Increment product sales count (non-critical)
  try {
    await supabase.rpc("increment_sales", { product_id: params.product_id })
  } catch {
    // Non-critical, ignore
  }

  return { success: true, order }
}

// --- Complete order: release escrow to seller ---

export async function completeOrder(orderId: string, buyerId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // 1. Get the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("buyer_id", buyerId)
    .eq("status", "pending")
    .single()

  if (orderError || !order) {
    return { success: false, error: "Заказ не найден или уже завершен" }
  }

  // 2. Get seller's current balance
  const { data: seller, error: sellerError } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", order.seller_id)
    .single()

  if (sellerError || !seller) {
    return { success: false, error: "Не удалось найти продавца" }
  }

  // 3. Transfer escrow to seller
  const { error: transferError } = await supabase
    .from("profiles")
    .update({ balance: seller.balance + order.escrow_amount })
    .eq("id", order.seller_id)

  if (transferError) {
    console.error("[v0] Error transferring escrow:", transferError)
    return { success: false, error: "Ошибка перевода средств продавцу" }
  }

  // 4. Mark order as completed, clear escrow
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "completed", escrow_amount: 0 })
    .eq("id", orderId)

  if (updateError) {
    // Rollback seller balance
    await supabase
      .from("profiles")
      .update({ balance: seller.balance })
      .eq("id", order.seller_id)

    console.error("[v0] Error updating order status:", updateError)
    return { success: false, error: "Ошибка завершения заказа" }
  }

  return { success: true }
}

// --- Queries ---

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      products (
        title,
        image_url
      )
    `)
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching orders:", error)
    return []
  }

  return (data || []).map((o: any) => ({
    ...o,
    product: o.products,
  }))
}

export async function getOrdersBySeller(sellerId: string): Promise<Order[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      products (
        title,
        image_url
      )
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching seller orders:", error)
    return []
  }

  return (data || []).map((o: any) => ({
    ...o,
    product: o.products,
  }))
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "completed" | "cancelled",
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

  if (error) {
    console.error("[v0] Error updating order status:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
