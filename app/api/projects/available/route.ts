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

        // Récupérer tous les projets ouverts créés par les clients
        const projects = await prisma.project.findMany({
            where: {
                status: "OPEN", // Seulement les projets ouverts
                // Exclure les projets où ce seller a déjà une offre acceptée
                NOT: {
                    proposals: {
                        some: {
                            sellerId: session.user.seller?.id,
                            status: "ACCEPTED",
                        },
                    },
                },
            },
            include: {
                client: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        proposals: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        // Formater les données pour l'affichage
        const formattedProjects = projects.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            budget: project.budget,
            deadline: project.deadline,
            category: project.category,
            status: project.status.toLowerCase(),
            location: project.location,
            createdAt: project.createdAt,
            client: {
                name: project.client.user.name,
                email: project.client.user.email,
            },
            _count: {
                proposals: project._count.proposals,
            },
        }))

        return NextResponse.json(formattedProjects)
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération des projets" }, { status: 500 })
    }
}
