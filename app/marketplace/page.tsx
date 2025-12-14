import { getCurrentUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { CategoryShortcuts } from "@/components/category-shortcuts"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/products"

export default async function MarketplacePage() {
  const user = await getCurrentUser()
  const products = await getProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Category Shortcuts */}
          <CategoryShortcuts />

          {/* Featured Carousel */}
          <FeaturedCarousel />

          {/* Products Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Популярные товары</h2>
            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Товары пока не добавлены</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
