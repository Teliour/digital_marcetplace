"use client"

import { useState } from "react"
import { Plus, Package, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteProduct, type Product } from "@/lib/products"
import { CreateProductDialog } from "./create-product-dialog"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export function SellerDashboard({
  user,
  products: initialProducts,
}: {
  user: any
  products: Product[]
}) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [products, setProducts] = useState(initialProducts)
  const { toast } = useToast()

  const handleProductCreated = (product: Product) => {
    setProducts((prev) => [...prev, product])
  }

  const handleDeleteProduct = async (productId: string) => {
    const result = await deleteProduct(productId)
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast({ title: "Товар удален" })
    } else {
      toast({ title: "Ошибка", description: result.error, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Панель продавца</h1>
          <p className="text-muted-foreground">Управляйте своими товарами</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Создать товар
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего товаров</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего продаж</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.reduce((sum, p) => sum + (p.sales ?? 0), 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний рейтинг</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0
                ? (products.reduce((sum, p) => sum + (p.rating ?? 0), 0) / products.length).toFixed(1)
                : "0.0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Мои товары</CardTitle>
          <CardDescription>
            {products.length === 0
              ? "У вас пока нет товаров. Создайте свой первый товар!"
              : `Всего товаров: ${products.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">Товары отсутствуют</p>
              <p className="text-sm text-muted-foreground mb-4">Начните продавать, создав свой первый товар</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Создать товар
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="relative h-20 w-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{product.title}</h3>
                      {product.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-primary">{product.price} ₽</span>
                      <span className="text-muted-foreground">Рейтинг: {(product.rating ?? 0).toFixed(1)}</span>
                      <span className="text-muted-foreground">Продаж: {product.sales ?? 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateProductDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        user={user}
        onProductCreated={handleProductCreated}
      />
    </div>
  )
}
