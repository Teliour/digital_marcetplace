import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { getProductsBySeller } from "@/lib/products"
import { SellerDashboard } from "@/components/seller-dashboard"

export default async function SellerPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const products = await getProductsBySeller(user.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <SellerDashboard user={user} products={products} />
        </div>
      </main>
    </div>
  )
}
