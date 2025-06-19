import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        console.log("📥 Requête GET reçue pour les projets clients")

        const session = await getServerSession(authOptions)
        console.log("🧾 Session utilisateur :", session)

        if (!session?.user || session.user.role !== "SELLER") {
            console.warn("⛔ Accès refusé - utilisateur non authentifié ou pas SELLER")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const sellerId = session.user.seller?.id
        if (!sellerId) {
            console.error("❌ ID du vendeur non trouvé dans la session")
            return NextResponse.json({ error: "Identifiant du vendeur manquant" }, { status: 400 })
        }

        console.log("🔍 ID vendeur :", sellerId)

        const projects = await prisma.project.findMany({
            where: {
                status: "OPEN",
                proposals: {
                    none: {
                        status: "accepted", // on exclut les projets avec une proposition acceptée
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

        console.log(`✅ ${projects.length} projets ouverts trouvés`)

        const formattedProjects = projects.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            deadline: project.deadline,
            status: project.status.toLowerCase(),
            createdAt: project.created_at,
            client: {
                name: project.client.user.name,
                email: project.client.user.email,
            },
            _count: {
                proposals: project._count.proposals,
            },
        }))

        console.log("🧾 Projets formatés :", formattedProjects)

        return NextResponse.json(formattedProjects)
    } catch (error) {
        console.error("🔥 Erreur lors de la récupération des projets:", error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des projets", detail: (error as Error).message },
            { status: 500 }
        )
    }
}
