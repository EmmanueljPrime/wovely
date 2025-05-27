"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth(requireAuth = false) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (requireAuth && status === "unauthenticated") {
            router.push("/auth/login")
        }
    }, [requireAuth, status, router])

    return {
        user: session?.user,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        isClient: session?.user?.role === "CLIENT",
        isSeller: session?.user?.role === "SELLER",
        session,
        status,
    }
}

export function useRequireAuth() {
    return useAuth(true)
}

export function useRequireRole(role: "CLIENT" | "SELLER") {
    const { user, isLoading, isAuthenticated } = useAuth(true)
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role !== role) {
            if (user?.role === "CLIENT") {
                router.push("/client/account")
            } else if (user?.role === "SELLER") {
                router.push("/seller/dashboard")
            } else {
                router.push("/unauthorized")
            }
        }
    }, [isLoading, isAuthenticated, user?.role, role, router])

    return { user, isLoading, isAuthenticated, hasCorrectRole: user?.role === role }
}
