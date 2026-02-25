"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Package, Clock, CheckCircle, XCircle, Loader2, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { completeOrder, type Order } from "@/lib/orders"
import { useToast } from "@/hooks/use-toast"

const statusConfig = {
  pending: {
    label: "Ожидает подтверждения",
    icon: Clock,
    variant: "secondary" as const,
  },
  completed: {
    label: "Завершен",
    icon: CheckCircle,
    variant: "default" as const,
  },
  cancelled: {
    label: "Отменен",
    icon: XCircle,
    variant: "destructive" as const,
  },
}

export function OrdersList({ orders: initialOrders, userId }: { orders: Order[]; userId: string }) {
  const [orders, setOrders] = useState(initialOrders)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleCompleteOrder = async (orderId: string) => {
    setCompletingId(orderId)
    const result = await completeOrder(orderId, userId)

    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "completed" as const, escrow_amount: 0 } : o))
      )
      toast({ title: "Заказ завершен", description: "Средства переведены продавцу" })
      router.refresh()
    } else {
      toast({ title: "Ошибка", description: result.error, variant: "destructive" })
    }
    setCompletingId(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Мои заказы</h1>
        <p className="text-muted-foreground">История покупок и текущие заказы</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">Заказы отсутствуют</p>
            <p className="text-sm text-muted-foreground">Вы еще не совершили ни одной покупки</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status]
            const StatusIcon = status.icon
            const isCompleting = completingId === order.id

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Заказ #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={order.product?.image_url || "/placeholder.svg"}
                        alt={order.product?.title || "Товар"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{order.product?.title || "Товар"}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Данные доставки: {order.customer_data}
                      </p>
                      {order.status === "pending" && order.escrow_amount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <Wallet className="h-3 w-3" />
                          <span>Средства удержаны: {order.escrow_amount} ₽</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-2xl font-bold">{order.amount} ₽</p>
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteOrder(order.id)}
                          disabled={isCompleting}
                        >
                          {isCompleting ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          Завершить заказ
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
