import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        console.log("🟢 Session récupérée:", session)

        if (!session?.user || session.user.role !== "CLIENT") {
            console.warn("🔒 Accès non autorisé ou utilisateur non client")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const clientId = session.user.client?.id
        if (!clientId) {
            console.error("❌ clientId introuvable dans la session utilisateur")
            return NextResponse.json({ error: "Client introuvable" }, { status: 400 })
        }

        const projects = await prisma.project.findMany({
            where: { clientId },
            include: {
                _count: {
                    select: {
                        proposals: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })

        console.log(`✅ ${projects.length} projets récupérés pour le client ${clientId}`)

        return NextResponse.json({ projects })
    } catch (error) {
        console.error("🔥 Erreur lors de la récupération des projets:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération des projets" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        console.log("🔐 Session backend :", session)

        if (!session?.user || session.user.role !== "CLIENT") {
            console.warn("🔒 Accès refusé : utilisateur non authentifié ou non CLIENT")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = await request.json()
        console.log("📥 Données reçues :", body)

        const { title, description, deadline } = body

        const project = await prisma.project.create({
            data: {
                title,
                description,
                deadline: deadline ? new Date(deadline) : null,
                clientId: session.user.client?.id!,
                status: "OPEN",
            },
        })

        console.log("✅ Projet créé :", project)
        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error("🔥 Erreur lors de la création du projet :", error)
        return NextResponse.json(
            { error: "Erreur lors de la création du projet", detail: (error as Error).message },
            { status: 500 }
        )
    }
}
