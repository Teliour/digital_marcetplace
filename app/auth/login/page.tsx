import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default async function LoginPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/marketplace")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Вход в DigiMarket</h1>
          <p className="text-muted-foreground mt-2">Войдите в свой аккаунт</p>
        </div>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Нет аккаунта? Сначала зарегистрируйтесь, затем подтвердите email из письма.
          </AlertDescription>
        </Alert>

        <LoginForm />
      </div>
    </div>
  )
}
