import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { redirect } from "next/navigation"

export async function getSession() {
    return await getServerSession(authOptions)
}

export async function getCurrentUser() {
    const session = await getSession()
    return session?.user
}

export async function requireAuth() {
    const session = await getSession()
    if (!session) {
        redirect("/auth/login")
    }
    return session
}

export async function requireRole(role: "CLIENT" | "SELLER") {
    const session = await requireAuth()
    if (session.user.role !== role) {
        redirect("/unauthorized")
    }
    return session
}
