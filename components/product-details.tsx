"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShieldCheck, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/products"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ProductDetails({ product, user }: { product: Product; user: any | null }) {
  const [quantity, setQuantity] = useState(1)
  const [customerData, setCustomerData] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const handlePurchase = () => {
    setShowPaymentDialog(true)
  }

  return (
    <>
      <div className="mb-4">
        <Link href="/marketplace">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к каталогу
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Image and Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                {product.badge && (
                  <Badge className="absolute left-4 top-4 bg-destructive text-destructive-foreground">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 text-balance">{product.title}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-muted-foreground">({product.sales.toLocaleString("ru-RU")} отзывов)</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">О товаре</h2>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Безопасно</p>
                        <p className="text-xs text-muted-foreground">Все сделки защищены</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Clock className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Моментально</p>
                        <p className="text-xs text-muted-foreground">Доставка 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Star className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Надежный продавец</p>
                        <p className="text-xs text-muted-foreground">{product.sales.toLocaleString("ru-RU")}+ продаж</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle>О продавце</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {product.sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-lg">{product.sellerName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating} рейтинг</span>
                    <span>•</span>
                    <span>{product.sales.toLocaleString("ru-RU")} продаж</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Purchase Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Купить товар</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold">{product.price * quantity} ₽</span>
                </div>
                <p className="text-sm text-muted-foreground">{product.price} ₽ за единицу</p>
              </div>

              <Separator />

              {!user ? (
                <div className="space-y-4 py-4">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">Для покупки товаров необходимо войти в аккаунт</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="w-full" size="lg">
                      <Link href="/auth/login">Войти</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/auth/sign-up">Зарегистрироваться</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Количество</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-data">
                      Данные для доставки
                      <span className="text-sm text-muted-foreground block mt-1">
                        {product.category.includes("Steam")
                          ? "Укажите логин Steam аккаунта"
                          : product.category.includes("PlayStation")
                            ? "Укажите email PlayStation"
                            : "Укажите email для получения"}
                      </span>
                    </Label>
                    <Input
                      id="customer-data"
                      placeholder={product.category.includes("Steam") ? "example_steam_login" : "example@email.com"}
                      value={customerData}
                      onChange={(e) => setCustomerData(e.target.value)}
                    />
                  </div>

                  {product.category.includes("Steam") && (
                    <div className="space-y-2">
                      <Label htmlFor="additional-info">Дополнительная информация (необязательно)</Label>
                      <Textarea id="additional-info" placeholder="Любые комментарии к заказу" rows={3} />
                    </div>
                  )}
                </>
              )}
            </CardContent>
            {user && (
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handlePurchase} disabled={!customerData}>
                  Оплатить {product.price * quantity} ₽
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оплата</DialogTitle>
            <DialogDescription>Интеграция платежной системы</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-center text-lg font-semibold">Оплата появится позже</p>
            <p className="text-center text-sm text-muted-foreground">
              Функция оплаты находится в разработке. Обычно платежные системы интегрируются специалистами банков.
            </p>
            <Button onClick={() => setShowPaymentDialog(false)} className="w-full">
              Понятно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
