import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "SELLER") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const sellerId = session.user.seller?.id
        if (!sellerId) {
            return NextResponse.json({ error: "ID du vendeur manquant" }, { status: 400 })
        }

        const resolvedParams = await params
        const projectId = parseInt(resolvedParams.id)
        if (isNaN(projectId)) {
            return NextResponse.json({ error: "ID de projet invalide" }, { status: 400 })
        }

        const { status } = await request.json()

        // Vérifier que le statut est valide
        const validStatuses = ["pending", "accepted", "in_progress", "completed", "cancelled"]
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Statut invalide" },
                { status: 400 }
            )
        }

        // Vérifier que le seller a une proposition acceptée pour ce projet
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                proposals: {
                    some: {
                        sellerId: sellerId,
                        status: "accepted",
                    },
                },
            },
            include: {
                proposals: {
                    where: {
                        sellerId: sellerId,
                        status: "accepted",
                    },
                },
            },
        })

        if (!project) {
            return NextResponse.json(
                { error: "Projet non trouvé ou vous n'avez pas de proposition acceptée" },
                { status: 404 }
            )
        }

        // Mettre à jour le statut du projet
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                status: status,
                updated_at: new Date(),
            },
        })

        return NextResponse.json({
            success: true,
            project: {
                id: updatedProject.id,
                status: updatedProject.status,
                updated_at: updatedProject.updated_at,
            },
        })
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error)
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour du statut", detail: (error as Error).message },
            { status: 500 }
        )
    }
}
