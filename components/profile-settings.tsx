"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserIcon, Mail, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function ProfileSettings({ user }: { user: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    display_name: user.display_name || user.email?.split("@")[0],
    email: user.email,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно сохранены",
    })

    setIsLoading(false)
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки профиля</h1>
        <p className="text-muted-foreground">Управляйте своим аккаунтом</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-bold">
              {(formData.display_name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle>{formData.display_name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Личная информация</CardTitle>
          <CardDescription>Обновите свои личные данные</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Безопасность
          </CardTitle>
          <CardDescription>Управление паролем и безопасностью аккаунта</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full bg-transparent">
            Изменить пароль
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
