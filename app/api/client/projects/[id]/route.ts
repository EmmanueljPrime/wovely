import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, context: { params: { id?: string } }) {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "CLIENT") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const projectId = Number(context.params?.id)
    if (isNaN(projectId)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const clientId = session.user.client?.id
    const body = await request.json()
    const { title, description, deadline } = body

    try {
        const updated = await prisma.project.update({
            where: { id: projectId, clientId },
            data: {
                title,
                description,
                deadline: deadline ? new Date(deadline) : null,
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Erreur PUT projet :", error)
        return NextResponse.json({ error: "Projet non trouvé ou accès refusé" }, { status: 404 })
    }
}

export async function DELETE(request: NextRequest, context: { params: { id?: string } }) {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "CLIENT") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const projectId = Number(context.params?.id)
    if (isNaN(projectId)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const clientId = session.user.client?.id

    try {
        await prisma.project.delete({
            where: { id: projectId, clientId },
        })

        return NextResponse.json({ message: "Projet supprimé" })
    } catch (error) {
        console.error("Erreur DELETE projet :", error)
        return NextResponse.json({ error: "Suppression impossible" }, { status: 404 })
    }
}