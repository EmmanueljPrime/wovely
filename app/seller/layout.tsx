"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import SellerSidebar from "@/components/seller-sidebar"

export default function SellerLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return

        if (!session) {
            router.push("/auth/login")
            return
        }

        if (session.user.role !== "SELLER") {
            router.push("/")
            return
        }
    }, [session, status, router])

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-2">Chargement...</p>
                </div>
            </div>
        )
    }

    if (!session || session.user.role !== "SELLER") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Accès non autorisé</h2>
                    <p className="text-gray-600">Vous devez être connecté en tant que vendeur.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SellerSidebar />
            <div className="flex-1">{children}</div>
        </div>
    )
}
