"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  userType?: "CLIENT" | "SELLER" | null
  requireAuth?: boolean
}

export default function AuthGuard({ children, userType, requireAuth = false }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/", "/auth/login", "/auth/register"]
    const isPublicRoute = publicRoutes.includes(pathname) || pathname === "/"

    // If loading, do nothing
    if (status === "loading") return

    // If authentication is required but user is not authenticated
    if (requireAuth && status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    // If not authenticated and not on a public route, redirect to login
    if (status === "unauthenticated" && !isPublicRoute) {
      router.push("/auth/login")
      return
    }

    // If authenticated but wrong user type, redirect to appropriate dashboard
    if (session && userType && session.user.role !== userType) {
      if (session.user.role === "CLIENT") {
        router.push("/client/account")
      } else if (session.user.role === "SELLER") {
        router.push("/seller/dashboard")
      }
      return
    }
  }, [session, status, pathname, router, userType, requireAuth])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/register"]
  const isPublicRoute = publicRoutes.includes(pathname) || pathname === "/"

  // If authentication is required but user is not authenticated
  if (requireAuth && status === "unauthenticated") {
    return null // useEffect will redirect
  }

  // If not authenticated and not on a public route
  if (status === "unauthenticated" && !isPublicRoute) {
    return null // useEffect will redirect
  }

  // If authenticated but wrong user type
  if (session && userType && session.user.role !== userType) {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Accès non autorisé</h2>
            <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
          </div>
        </div>
    )
  }

  // If authorized or on a public route, show the children
  return <>{children}</>
}
