"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { register } from "@/lib/auth"

export function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const displayName = formData.get("displayName") as string

    console.log("[v0] Attempting registration for:", email)

    const result = await register(email, password, displayName)

    console.log("[v0] Registration result:", result.success ? "success" : "failed")

    if (result.success) {
      toast({
        title: "Регистрация успешна!",
        description: "Проверьте вашу почту для подтверждения. Затем можете войти в систему.",
      })
      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
    } else {
      toast({
        title: "Ошибка регистрации",
        description: result.error || "Не удалось создать аккаунт",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Имя</Label>
            <Input id="displayName" name="displayName" type="text" placeholder="Иван Иванов" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="example@mail.ru" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
