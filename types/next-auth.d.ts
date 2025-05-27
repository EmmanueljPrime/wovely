import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: "CLIENT" | "SELLER"
            client?: any
            seller?: any
        } & DefaultSession["user"]
    }

    interface User {
        role: "CLIENT" | "SELLER"
        client?: any
        seller?: any
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "CLIENT" | "SELLER"
        client?: any
        seller?: any
    }
}
