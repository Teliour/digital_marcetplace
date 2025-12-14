"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export function ConfirmEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    if (error) {
      setStatus("error")
      setMessage(errorDescription || "Не удалось подтвердить email")
    } else {
      // Успешное подтверждение
      setStatus("success")
      setMessage("Ваш email успешно подтвержден!")

      // Перенаправляем на маркетплейс через 3 секунды
      setTimeout(() => {
        router.push("/marketplace")
      }, 3000)
    }
  }, [searchParams, router])

  return (
    <Card className="w-full max-w-md shadow-2xl border-2">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          {status === "loading" && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
          {status === "success" && <CheckCircle2 className="h-8 w-8 text-green-600" />}
          {status === "error" && <XCircle className="h-8 w-8 text-red-600" />}
        </div>
        <CardTitle className="text-2xl">
          {status === "loading" && "Подтверждение email..."}
          {status === "success" && "Email подтвержден!"}
          {status === "error" && "Ошибка подтверждения"}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          {status === "loading" && "Пожалуйста, подождите..."}
          {status === "success" && message}
          {status === "error" && message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Вы будете автоматически перенаправлены на главную страницу через несколько секунд...
            </p>
            <Button onClick={() => router.push("/marketplace")} className="w-full">
              Перейти на маркетплейс
            </Button>
          </div>
        )}
        {status === "error" && (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Попробуйте войти в систему или зарегистрируйтесь снова</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/auth/login")} variant="outline" className="flex-1">
                Войти
              </Button>
              <Button onClick={() => router.push("/auth/sign-up")} className="flex-1">
                Регистрация
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
