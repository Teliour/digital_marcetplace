import { Header } from "@/components/header"
import { getCurrentUser } from "@/lib/auth"
import { getProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"

const categoryNames: Record<string, string> = {
  steam: "Пополнение Steam",
  games: "Игры",
  playstation: "PlayStation",
  apps: "Приложения",
  discounts: "Скидки 90%",
  new: "Новинки",
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser()
  const products = await getProducts()

  // Filter products by category
  const categoryProducts = products.filter((p) => {
    if (params.slug === "steam") return p.category?.includes("Steam")
    if (params.slug === "games") return p.category === "Игры"
    if (params.slug === "playstation") return p.category === "PlayStation"
    if (params.slug === "apps") return p.category === "Приложения"
    if (params.slug === "discounts") return p.badge?.includes("90%")
    if (params.slug === "new") return p.badge?.includes("НОВИНКА") || p.badge?.includes("Новая версия")
    return false
  })

  const categoryName = categoryNames[params.slug] || "Категория"

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{categoryName}</h1>
              <Badge variant="secondary">{categoryProducts.length} товаров</Badge>
            </div>
            <p className="text-muted-foreground">
              {params.slug === "discounts" && "Невероятные скидки до 90% на популярные товары"}
              {params.slug === "new" && "Самые свежие поступления в нашем каталоге"}
              {params.slug === "steam" && "Пополнение Steam кошелька с моментальной доставкой"}
              {params.slug === "games" && "Широкий выбор игр для всех платформ"}
              {params.slug === "playstation" && "Игры и подписки для PlayStation"}
              {params.slug === "apps" && "Полезные приложения и программное обеспечение"}
            </p>
          </div>

          {categoryProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">В этой категории пока нет товаров</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
