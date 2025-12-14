"use server"

import { createClient } from "@/lib/supabase/server"

export type Order = {
  id: string
  buyer_id: string
  product_id: string
  seller_id: string
  customer_data: string
  amount: number
  status: "pending" | "completed" | "cancelled"
  created_at: string
  product?: {
    title: string
    image_url: string
  }
}

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

export async function createOrder(orderData: {
  buyer_id: string
  product_id: string
  seller_id: string
  customer_data: string
  amount: number
}): Promise<{ success: boolean; error?: string; order?: Order }> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("orders").insert([orderData]).select().single()

  if (error) {
    console.error("[v0] Error creating order:", error)
    return { success: false, error: error.message }
  }

  return { success: true, order: data }
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
