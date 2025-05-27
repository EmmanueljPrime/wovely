import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "CLIENT") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        // Supprimer en cascade : client puis utilisateur
        await prisma.client.delete({
            where: { id: session.user.client?.id },
        })

        await prisma.user.delete({
            where: { id: session.user.id },
        })

        return NextResponse.json({ message: "Compte supprimé avec succès" })
    } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error)
        return NextResponse.json({ error: "Erreur lors de la suppression du compte" }, { status: 500 })
    }
}
