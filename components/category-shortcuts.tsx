import Link from "next/link"
import { Gamepad2, Smartphone, CreditCard, Star, Gift, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "Пополнение Steam", icon: CreditCard, href: "/category/steam" },
  { name: "Игры", icon: Gamepad2, href: "/category/games" },
  { name: "PlayStation", icon: Tv, href: "/category/playstation" },
  { name: "Приложения", icon: Smartphone, href: "/category/apps" },
  { name: "Скидки 90%", icon: Star, href: "/category/discounts" },
  { name: "Новинки", icon: Gift, href: "/category/new" },
]

export function CategoryShortcuts() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Link key={category.name} href={category.href}>
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap bg-transparent">
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          </Link>
        )
      })}
    </div>
  )
}
