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

        // Récupérer tous les projets où ce vendeur a fait une proposition
        const projects = await prisma.project.findMany({
            where: {
                proposals: {
                    some: {
                        sellerId: sellerId,
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
                    },
                    select: {
                        id: true,
                        price: true,
                        message: true,
                        status: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            },
            orderBy: {
                updated_at: "desc",
            },
        })

        // Formater les données avec la logique de statut appropriée
        const formattedProjects = projects.map((project) => {
            const myProposal = project.proposals[0] // Il ne devrait y avoir qu'une seule proposition par vendeur par projet

            // Déterminer le statut affiché selon la logique métier
            let displayStatus = "pending"

            if (myProposal.status === "rejected") {
                displayStatus = "cancelled"
            } else if (myProposal.status === "pending") {
                displayStatus = "pending"
            } else if (myProposal.status === "accepted") {
                // Si la proposition est acceptée, regarder le statut du projet
                if (project.status === "pending") {
                    displayStatus = "accepted"
                } else if (project.status === "in_progress") {
                    displayStatus = "in_progress"
                } else if (project.status === "completed") {
                    displayStatus = "completed"
                } else {
                    displayStatus = "accepted"
                }
            }

            return {
                id: project.id,
                title: project.title,
                description: project.description,
                deadline: project.deadline,
                status: displayStatus,
                projectStatus: project.status, // Statut original du projet
                proposalStatus: myProposal.status, // Statut original de la proposition
                created_at: project.created_at,
                updated_at: project.updated_at,
                client: {
                    username: project.client.user.username,
                    email: project.client.user.email,
                },
                myProposal: {
                    id: myProposal.id,
                    price: myProposal.price,
                    message: myProposal.message,
                    status: myProposal.status,
                    created_at: myProposal.created_at,
                    updated_at: myProposal.updated_at,
                },
            }
        })

        return NextResponse.json(formattedProjects)
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des projets", detail: (error as Error).message },
            { status: 500 }
        )
    }
}
