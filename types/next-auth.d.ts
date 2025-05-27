import type { Role } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: Role
            client?: any
            seller?: any
        }
    }

    interface User {
        role: Role
        client?: any
        seller?: any
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role
        client?: any
        seller?: any
    }
}
