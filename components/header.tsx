"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, UserIcon, Package, LogOut, Settings, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthDialog } from "./auth-dialog"
import { logout } from "@/lib/auth"

export function Header({ user }: { user: any | null }) {
  const [authOpen, setAuthOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/marketplace" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DigiMarket</span>
        </Link>

        {/* Catalog Button */}
        <Button variant="default" className="hidden md:flex" asChild>
          <Link href="/marketplace">Каталог</Link>
        </Button>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск по товарам, категориям и продавцам"
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.display_name || user.email?.split("@")[0]}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/seller" className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  Панель продавца
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/orders" className="cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  Заказы
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Изменить профиль
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Выход
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => setAuthOpen(true)}>Войти</Button>
        )}
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}
