import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "CLIENT") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = await request.json()
        const { firstname, lastname, email, phone, address, city, postalCode, country } = body

        // Mettre à jour l'utilisateur
        await prisma.user.update({
            where: { id: session.user.id },
            data: { email },
        })

        // Mettre à jour le client
        await prisma.client.update({
            where: { id: session.user.client?.id },
            data: {
                firstname,
                lastname,
                phone,
                address,
                city,
                postalCode,
                country,
            },
        })

        return NextResponse.json({ message: "Profil mis à jour avec succès" })
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error)
        return NextResponse.json({ error: "Erreur lors de la mise à jour du profil" }, { status: 500 })
    }
}
