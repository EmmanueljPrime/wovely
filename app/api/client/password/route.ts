import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "CLIENT") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = await request.json()
        const { currentPassword, newPassword } = body

        // Récupérer l'utilisateur avec le mot de passe
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true },
        })

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
        }

        // Vérifier le mot de passe actuel
        const isValidPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isValidPassword) {
            return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 })
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 12)

        // Mettre à jour le mot de passe
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        })

        return NextResponse.json({ message: "Mot de passe modifié avec succès" })
    } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error)
        return NextResponse.json({ error: "Erreur lors du changement de mot de passe" }, { status: 500 })
    }
}
