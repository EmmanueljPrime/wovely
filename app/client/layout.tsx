"use client"

import type React from "react"
import AuthGuard from "@/components/auth-guard"

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard requireAuth requiredRole="CLIENT">
            {/* Le header et footer sont gérés par ConditionalLayout */}
            {/* Les clients gardent la navigation normale + leurs pages spécifiques */}
            {children}
        </AuthGuard>
    )
}