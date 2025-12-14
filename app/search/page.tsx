import { Header } from "@/components/header"
import { getCurrentUser } from "@/lib/auth"
import { getProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import { Search } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const user = await getCurrentUser()
  const products = await getProducts()

  const query = searchParams.q?.toLowerCase() || ""

  const searchResults = query
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.sellerName?.toLowerCase().includes(query),
      )
    : []

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-8 w-8 text-muted-foreground" />
              <h1 className="text-3xl font-bold">Результаты поиска</h1>
            </div>
            {query && (
              <p className="text-muted-foreground">
                По запросу "{query}" найдено {searchResults.length} товаров
              </p>
            )}
          </div>

          {!query ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Введите запрос для поиска товаров</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">По вашему запросу ничего не найдено</p>
              <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить запрос</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
