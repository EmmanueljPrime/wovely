"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
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
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function SellerSidebar() {
  const pathname = usePathname()
  const [catalogsOpen, setCatalogsOpen] = useState(true)

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
      <div className="w-64 border-r min-h-screen bg-white">
        <div className="p-4">
          <div className="flex items-center justify-center p-4 border-b">
            <Link href="/seller/dashboard" className="flex items-center text-teal-600">
              <div className="mr-2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="4" fill="#E6F7F4" />
                  <path
                      d="M8 6H24V26H8V6Z"
                      stroke="#0D9488"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  />
                  <path d="M8 10H24" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 14H24" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 18H24" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 22H24" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-semibold">My Tailor</span>
            </Link>
          </div>

          <nav className="mt-6 space-y-1">
            <Link
                href="/seller/dashboard"
                className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
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
                      "flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-md",
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
                            "block px-4 py-2 text-sm rounded-md",
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
                            "block px-4 py-2 text-sm rounded-md",
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
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive("/seller/orders") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
                )}
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Orders
            </Link>

            <Link
                href="/seller/projects"
                className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive("/seller/projects") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
                )}
            >
              <FolderKanban className="mr-3 h-5 w-5" />
              Projects
            </Link>

            <Link
                href="/seller/my-projects"
                className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive("/seller/my-projects") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
                )}
            >
              <FolderKanban className="mr-3 h-5 w-5" />
              My Projects
            </Link>

            <Link
                href="/seller/profile"
                className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive("/seller/profile") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
                )}
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </Link>

            <Link
                href="/seller/account"
                className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive("/seller/account") ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-100",
                )}
            >
              <Settings className="mr-3 h-5 w-5" />
              Account Settings
            </Link>

            <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      </div>
  )
}
