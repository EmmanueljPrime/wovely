"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface ConditionalLayoutProps {
    children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const { data: session, status } = useSession()
    const pathname = usePathname()

    // Routes qui ne doivent jamais avoir de header/footer
    const noLayoutRoutes = ["/auth/login", "/auth/register"]
    const isNoLayoutRoute = noLayoutRoutes.includes(pathname)

    // Routes seller qui ont leur propre layout avec sidebar
    const isSellerRoute = pathname.startsWith("/seller/")

    // Si c'est une route sans layout (auth), afficher seulement le contenu
    if (isNoLayoutRoute) {
        return <>{children}</>
    }

    // Si c'est une route seller, afficher seulement le contenu (la sidebar est gérée dans seller/layout.tsx)
    if (isSellerRoute) {
        return <>{children}</>
    }

    // Pour toutes les autres routes (accueil, client, etc.), afficher header + footer
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
