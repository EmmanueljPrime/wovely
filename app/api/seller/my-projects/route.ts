import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "SELLER") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const sellerId = session.user.seller?.id
        if (!sellerId) {
            return NextResponse.json({ error: "ID du vendeur manquant" }, { status: 400 })
        }

        // Récupérer les projets liés à une proposition acceptée par ce vendeur
        const projects = await prisma.project.findMany({
            where: {
                proposals: {
                    some: {
                        sellerId: sellerId,
                        status: "accepted",
                    },
                },
            },
            include: {
                client: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                email: true,
                            },
                        },
                    },
                },
                proposals: {
                    where: {
                        sellerId: sellerId,
                        status: "accepted",
                    },
                    select: {
                        price: true,
                        updated_at: true, // à défaut de acceptedAt qui n’existe pas
                    },
                },
            },
            orderBy: {
                updated_at: "desc",
            },
        })

        // Formater les données
        const formattedProjects = projects.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            deadline: project.deadline,
            status: project.status,
            created_at: project.created_at,
            updated_at: project.updated_at,
            client: {
                username: project.client.user.username,
                email: project.client.user.email,
            },
            acceptedProposal: project.proposals[0] || null,
        }))

        return NextResponse.json(formattedProjects)
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des projets", detail: (error as Error).message },
            { status: 500 }
        )
    }
}
