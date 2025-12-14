import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/marketplace")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-4xl font-bold text-balance">Добро пожаловать в DigiMarket</h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Маркетплейс цифровых товаров - покупайте игры, ключи активации, пополнения Steam и другие цифровые продукты
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/marketplace">Перейти к покупкам</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-up">Зарегистрироваться</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
