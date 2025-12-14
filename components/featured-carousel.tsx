"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const featuredItems = [
  {
    title: "Распродажа PlayStation",
    subtitle: "Скидки до 90%",
    image: "/playstation-sale-banner-blue.jpg",
    color: "from-blue-600 to-blue-800",
  },
  {
    title: "Черная пятница",
    subtitle: "Специальные предложения на игры",
    image: "/black-friday-gaming-deals.jpg",
    color: "from-gray-800 to-gray-900",
  },
  {
    title: "Пополнение Steam",
    subtitle: "Моментальная доставка",
    image: "/steam-wallet-cards.jpg",
    color: "from-indigo-600 to-indigo-800",
  },
]

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)
  }

  const current = featuredItems[currentIndex]

  return (
    <Card className="relative overflow-hidden">
      <div className={`relative h-[300px] md:h-[400px] bg-gradient-to-r ${current.color}`}>
        <Image src={current.image || "/placeholder.svg"} alt={current.title} fill className="object-cover opacity-30" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-balance">{current.title}</h2>
          <p className="text-xl md:text-2xl text-balance">{current.subtitle}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
        onClick={prev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
        onClick={next}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-8" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </Card>
  )
}
