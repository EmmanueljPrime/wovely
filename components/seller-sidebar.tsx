"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  User,
  FolderKanban,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image";

export default function SellerSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [catalogsOpen, setCatalogsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
    }
    return session?.user?.email?.[0]?.toUpperCase() || "U"
  }

  return (
      <div className="w-64 border-r min-h-screen bg-white flex flex-col">
        {/* Header avec logo et recherche */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center mb-4">
            <Link href="/seller/dashboard" className="flex items-center text-teal-600">
              <Image
                  src="/wovelyLogo.png"
                  alt="Wovely Logo"
                  width={100}
                  height={40}
                  priority={true}
                  style={{ width: "auto", height: "auto", maxWidth: "100px", maxHeight: "40px" }}
              />
            </Link>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-4">
            <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-4 pr-10 py-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session?.user?.name && <p className="font-medium text-sm">{session.user.name}</p>}
                    <p className="w-[200px] truncate text-xs text-muted-foreground">{session?.user?.email}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.seller?.business_name}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/seller/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/seller/account" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
              href="/seller/dashboard"
              className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive("/seller/dashboard") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
              )}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <div>
            <button
                onClick={() => setCatalogsOpen(!catalogsOpen)}
                className={cn(
                    "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive("/seller/catalogs") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
                )}
            >
              <div className="flex items-center">
                <ShoppingBag className="mr-3 h-5 w-5" />
                Catalogs
              </div>
              {catalogsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {catalogsOpen && (
                <div className="pl-12 mt-1 space-y-1">
                  <Link
                      href="/seller/catalogs"
                      className={cn(
                          "block px-4 py-2 text-sm rounded-md transition-colors",
                          isActive("/seller/catalogs") && pathname === "/seller/catalogs"
                              ? "text-teal-600 font-medium"
                              : "text-gray-600 hover:bg-gray-100",
                      )}
                  >
                    All Catalogs
                  </Link>
                  <Link
                      href="/seller/catalogs/new"
                      className={cn(
                          "block px-4 py-2 text-sm rounded-md transition-colors",
                          isActive("/seller/catalogs/new") ? "text-teal-600 font-medium" : "text-gray-600 hover:bg-gray-100",
                      )}
                  >
                    Add New Catalog
                  </Link>
                </div>
            )}
          </div>

          <Link
              href="/seller/orders"
              className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive("/seller/orders") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
              )}
          >
            <ClipboardList className="mr-3 h-5 w-5" />
            Orders
          </Link>

          <Link
              href="/seller/projects"
              className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive("/seller/projects") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
              )}
          >
            <FolderKanban className="mr-3 h-5 w-5" />
            Projects
          </Link>

          <Link
              href="/seller/my-projects"
              className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive("/seller/my-projects") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
              )}
          >
            <FolderKanban className="mr-3 h-5 w-5" />
            My Projects
          </Link>

          <Link
              href="/seller/profile"
              className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive("/seller/profile") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
              )}
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>

          <Link
              href="/seller/account"
              className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive("/seller/account") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
              )}
          >
            <Settings className="mr-3 h-5 w-5" />
            Account Settings
          </Link>
        </nav>

        {/* Footer avec bouton logout */}
        <div className="p-4 border-t">
          <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
  )
}
