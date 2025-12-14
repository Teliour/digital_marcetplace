import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { getOrdersByUser } from "@/lib/orders"
import { OrdersList } from "@/components/orders-list"

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const orders = await getOrdersByUser(user.id)

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <OrdersList orders={orders} />
        </div>
      </main>
    </div>
  )
}
