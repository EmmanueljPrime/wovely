"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "CLIENT" | "SELLER"
  requireAuth?: boolean
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, requiredRole, requireAuth = false, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/", "/auth/login", "/auth/register", "/unauthorized"]
    const isPublicRoute = publicRoutes.includes(pathname)

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

    // If authenticated but wrong user type, redirect appropriately
    if (session && requiredRole && session.user.role !== requiredRole) {
      if (session.user.role === "CLIENT") {
        router.push("/client/account")
      } else if (session.user.role === "SELLER") {
        router.push("/seller/dashboard")
      } else {
        router.push("/unauthorized")
      }
      return
    }
  }, [session, status, pathname, router, requiredRole, requireAuth])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
        fallback || (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
                <p className="text-gray-600">Chargement...</p>
              </div>
            </div>
        )
    )
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/register", "/unauthorized"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // If authentication is required but user is not authenticated
  if (requireAuth && status === "unauthenticated") {
    return null // useEffect will redirect
  }

  // If not authenticated and not on a public route
  if (status === "unauthenticated" && !isPublicRoute) {
    return null // useEffect will redirect
  }

  // If authenticated but wrong user type
  if (session && requiredRole && session.user.role !== requiredRole) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">Vous n'avez pas les permissions pour accéder à cette page.</p>
            <button
                onClick={() => router.back()}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
    )
  }

  // If authorized or on a public route, show the children
  return <>{children}</>
}
