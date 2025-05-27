"use client"

import type React from "react"
import AuthGuard from "@/components/auth-guard"
import SellerSidebar from "@/components/seller-sidebar"

export default function SellerLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard requireAuth requiredRole="SELLER">
            <div className="flex min-h-screen bg-gray-50">
                <SellerSidebar />
                <div className="flex-1 overflow-auto">{children}</div>
            </div>
        </AuthGuard>
    )
}
