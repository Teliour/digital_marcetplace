"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { login, register } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await login(email, password)

    if (result.success) {
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать, ${result.user?.display_name}!`,
      })
      onOpenChange(false)
      router.refresh()
    } else {
      toast({
        title: "Ошибка",
        description: result.error,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const displayName = formData.get("displayName") as string

    const result = await register(email, password, displayName)

    if (result.success) {
      toast({
        title: "Регистрация успешна",
        description: "Проверьте вашу почту для подтверждения аккаунта",
      })
      onOpenChange(false)
      router.refresh()
    } else {
      toast({
        title: "Ошибка",
        description: result.error,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Вход в аккаунт</DialogTitle>
          <DialogDescription>Войдите или зарегистрируйтесь для продолжения</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" placeholder="example@mail.ru" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input id="login-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-displayName">Имя</Label>
                <Input id="register-displayName" name="displayName" type="text" placeholder="Иван Иванов" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" name="email" type="email" placeholder="example@mail.ru" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input id="register-password" name="password" type="password" minLength={6} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
