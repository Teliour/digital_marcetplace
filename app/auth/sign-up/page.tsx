import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SignUpForm } from "@/components/signup-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default async function SignUpPage() {
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
          <h1 className="text-3xl font-bold">Регистрация</h1>
          <p className="text-muted-foreground mt-2">Создайте новый аккаунт</p>
        </div>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            После регистрации проверьте вашу почту для подтверждения аккаунта. Затем сможете войти.
          </AlertDescription>
        </Alert>

        <SignUpForm />
      </div>
    </div>
  )
}
