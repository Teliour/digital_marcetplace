"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createProduct, type Product } from "@/lib/products"

const categories = ["Пополнение Steam", "Игры", "PlayStation", "Приложения", "Robux", "Другое"]

const deliveryFields = [
  { value: "email", label: "Email для отправки" },
  { value: "steam", label: "Логин Steam" },
  { value: "psn", label: "Email PlayStation Network" },
  { value: "phone", label: "Номер телефона" },
  { value: "custom", label: "Другое (указать)" },
]

export function CreateProductDialog({
  open,
  onOpenChange,
  user,
  onProductCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  onProductCreated: (product: Product) => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const badge = formData.get("badge") as string
    const deliveryField = formData.get("deliveryField") as string

    const result = await createProduct({
      title,
      description,
      price,
      category,
      badge: badge || undefined,
      seller_id: user.id,
      image_url: imagePreview || "/placeholder.svg?height=400&width=600",
      required_field_type: deliveryField,
    })

    if (result.success && result.product) {
      toast({
        title: "Товар создан",
        description: `${title} успешно добавлен в каталог`,
      })
      onProductCreated(result.product)
      setImagePreview(null)
      onOpenChange(false)
    } else {
      toast({
        title: "Ошибка создания товара",
        description: result.error || "Попробуйте ещё раз",
        variant: "destructive",
      })
    }

    setIsLoading(false)
    router.refresh()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setImagePreview(null)
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новый товар</DialogTitle>
          <DialogDescription>Заполните информацию о товаре для добавления в каталог</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название товара *</Label>
            <Input id="title" name="title" placeholder="Например: Пополнение Steam Wallet" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание *</Label>
            <Textarea id="description" name="description" placeholder="Подробное описание товара" rows={4} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽) *</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="199" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge">Бейдж (необязательно)</Label>
            <Input id="badge" name="badge" placeholder="Например: -90%, НОВИНКА, АВТОПОПОЛНЕНИЕ" />
            <p className="text-xs text-muted-foreground">Будет отображаться на карточке товара</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Изображение товара</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryField">Поле для данных клиента *</Label>
            <Select name="deliveryField" required>
              <SelectTrigger>
                <SelectValue placeholder="Что нужно от клиента?" />
              </SelectTrigger>
              <SelectContent>
                {deliveryFields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Клиент укажет эти данные при покупке (email, логин Steam и т.д.)
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Создание..." : "Создать товар"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
