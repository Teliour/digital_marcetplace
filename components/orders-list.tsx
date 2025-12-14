import Image from "next/image"
import { Package, Clock, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/orders"

const statusConfig = {
  pending: {
    label: "В обработке",
    icon: Clock,
    variant: "secondary" as const,
  },
  completed: {
    label: "Выполнен",
    icon: CheckCircle,
    variant: "default" as const,
  },
  cancelled: {
    label: "Отменен",
    icon: XCircle,
    variant: "destructive" as const,
  },
}

export function OrdersList({ orders }: { orders: Order[] }) {
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

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                      <CardDescription>
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
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
                        src={order.productImage || "/placeholder.svg"}
                        alt={order.productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{order.productTitle}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Количество: {order.quantity} × {order.price} ₽
                      </p>
                      <p className="text-sm text-muted-foreground">Данные доставки: {order.customerData}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">{order.total} ₽</p>
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
