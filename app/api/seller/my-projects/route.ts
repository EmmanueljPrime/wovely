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

        // Récupérer les projets où ce seller a une proposition acceptée
        const projects = await prisma.project.findMany({
            where: {
                proposals: {
                    some: {
                        sellerId: session.user.seller?.id,
                        status: "ACCEPTED",
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
                proposals: {
                    where: {
                        sellerId: session.user.seller?.id,
                        status: "ACCEPTED",
                    },
                    select: {
                        price: true,
                        acceptedAt: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        })

        // Formater les données
        const formattedProjects = projects.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            budget: project.budget,
            deadline: project.deadline,
            status: project.status,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            client: project.client,
            acceptedProposal: project.proposals[0] || null,
        }))

        return NextResponse.json(formattedProjects)
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération des projets" }, { status: 500 })
    }
}
