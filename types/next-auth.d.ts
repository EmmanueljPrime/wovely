import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: "CLIENT" | "SELLER"
            createdAt?: string // Changer en string pour éviter les problèmes de sérialisation
            client?: {
                id: number
                userId: number
                firstname: string
                lastname: string
                phone?: string
                address?: string
                city?: string
                postalCode?: string
                country?: string
                createdAt: Date
                updatedAt: Date
            }
            seller?: {
                id: number
                userId: number
                business_name: string
                description?: string
                phone?: string
                address?: string
                city?: string
                postalCode?: string
                country?: string
                website?: string
                createdAt: Date
                updatedAt: Date
            }
        } & DefaultSession["user"]
    }

    interface User {
        role: "CLIENT" | "SELLER"
        createdAt?: string // Changer en string
        client?: any
        seller?: any
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "CLIENT" | "SELLER"
        createdAt?: string // Changer en string
        client?: any
        seller?: any
    }
}
