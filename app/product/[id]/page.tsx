import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { getProductById } from "@/lib/products"
import { ProductDetails } from "@/components/product-details"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params

  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <ProductDetails product={product} user={user} />
        </div>
      </main>
    </div>
  )
}
