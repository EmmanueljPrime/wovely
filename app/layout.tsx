import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import ConditionalLayout from "@/components/conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Wovely - Marketplace",
    description: "Marketplace for tailors and clothing",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster />
        </AuthProvider>
        </body>
        </html>
    )
}
