import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
          {product.badge && (
            <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground">{product.badge}</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 text-balance mb-2">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span>•</span>
            <span>{product.sales.toLocaleString("ru-RU")} продаж</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{product.price} ₽</p>
            <p className="text-xs text-muted-foreground">{product.sellerName}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
