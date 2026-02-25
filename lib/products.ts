"use server"

import { createClient } from "@/lib/supabase/server"

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  category: string
  seller_id: string
  seller_name?: string
  required_field_type: string
  required_field_label?: string
  stock_quantity?: number
  is_active: boolean
  created_at?: string
  badge?: string
  rating: number
  sales: number
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles:seller_id (
        display_name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }

  return (data || []).map((p: any) => ({
    ...p,
    seller_name: p.profiles?.display_name || "Продавец",
  }))
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles:seller_id (
        display_name
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }

  return {
    ...data,
    seller_name: data.profiles?.display_name || "Продавец",
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles:seller_id (
        display_name
      )
    `)
    .eq("category", category)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products by category:", error)
    return []
  }

  return (data || []).map((p: any) => ({
    ...p,
    seller_name: p.profiles?.display_name || "Продавец",
  }))
}

export async function createProduct(productData: {
  title: string
  description: string
  price: number
  category: string
  image_url: string
  required_field_type: string
  required_field_label?: string
  stock_quantity?: number
  seller_id: string
  badge?: string
}): Promise<{ success: boolean; error?: string; product?: Product }> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("products").insert([productData]).select().single()

  if (error) {
    console.error("[v0] Error creating product:", error)
    return { success: false, error: error.message }
  }

  return { success: true, product: data }
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      profiles:seller_id (
        display_name
      )
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching seller products:", error)
    return []
  }

  return (data || []).map((p: any) => ({
    ...p,
    seller_name: p.profiles?.display_name || "Продавец",
  }))
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", productId)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateProduct(
  productId: string,
  updates: Partial<Product>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("products").update(updates).eq("id", productId)

  if (error) {
    console.error("[v0] Error updating product:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
