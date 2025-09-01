import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        console.log("📥 API AVAILABLE: Requête GET reçue pour les projets clients")

        const session = await getServerSession(authOptions)
        console.log("🧾 API AVAILABLE: Session utilisateur :", {
            hasSession: !!session,
            userId: session?.user?.id,
            role: session?.user?.role,
            sellerId: session?.user?.seller?.id
        })

        if (!session?.user || session.user.role !== "SELLER") {
            console.warn("⛔ API AVAILABLE: Accès refusé - utilisateur non authentifié ou pas SELLER")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const sellerId = session.user.seller?.id
        if (!sellerId) {
            console.error("❌ API AVAILABLE: ID du vendeur non trouvé dans la session")
            return NextResponse.json({ error: "Identifiant du vendeur manquant" }, { status: 400 })
        }

        console.log("🔍 API AVAILABLE: ID vendeur :", sellerId)

        // D'abord, vérifions TOUS les projets existants pour diagnostiquer
        const allProjects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
                status: true,
                created_at: true,
                _count: {
                    select: {
                        proposals: true
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        })

        console.log("🔍 API AVAILABLE: TOUS les projets en base:", {
            count: allProjects.length,
            projects: allProjects.map(p => ({
                id: p.id,
                title: p.title,
                status: p.status,
                proposalsCount: p._count.proposals,
                createdAt: p.created_at.toISOString()
            }))
        })

        // Recherches avec différents statuts possibles
        console.log("🔍 API AVAILABLE: Recherche avec différents statuts...")

        // Test avec "OPEN"
        const projectsOPEN = await prisma.project.findMany({
            where: { status: "OPEN" },
            select: { id: true, title: true, status: true }
        })
        console.log("📊 API AVAILABLE: Projets avec statut 'OPEN':", projectsOPEN.length)

        // Test avec "open"
        const projectsOpen = await prisma.project.findMany({
            where: { status: "open" },
            select: { id: true, title: true, status: true }
        })
        console.log("📊 API AVAILABLE: Projets avec statut 'open':", projectsOpen.length)

        // Test avec "pending"
        const projectsPending = await prisma.project.findMany({
            where: { status: "pending" },
            select: { id: true, title: true, status: true }
        })
        console.log("📊 API AVAILABLE: Projets avec statut 'pending':", projectsPending.length)

        // Recherche avec statuts multiples
        const availableProjects = await prisma.project.findMany({
            where: {
                OR: [
                    { status: "OPEN" },
                    { status: "open" },
                    { status: "pending" },
                    { status: "PENDING" }
                ],
                proposals: {
                    none: {
                        status: "accepted"
                    }
                }
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

        console.log("📊 API AVAILABLE: Projets disponibles trouvés:", {
            count: availableProjects.length,
            projectsDetails: availableProjects.map(p => ({
                id: p.id,
                title: p.title,
                status: p.status,
                clientId: p.clientId,
                proposalsCount: p._count.proposals
            }))
        })

        // Formater les projets pour le frontend
        const formattedProjects = availableProjects.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            deadline: project.deadline,
            status: project.status.toLowerCase(), // Toujours en minuscules pour le frontend
            createdAt: project.created_at,
            client: {
                name: project.client.user?.username,
                email: project.client.user?.email,
            },
            _count: {
                proposals: project._count.proposals,
            },
        }))

        console.log("✅ API AVAILABLE: Projets formatés :", formattedProjects.map(p => ({
            id: p.id,
            title: p.title,
            status: p.status,
            statusOriginal: availableProjects.find(orig => orig.id === p.id)?.status
        })))

        console.log(`✅ ${availableProjects.length} projets disponibles trouvés`)
        return NextResponse.json(formattedProjects)
    } catch (error) {
        console.error("💥 API AVAILABLE: Erreur lors de la récupération des projets disponibles:", error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des projets disponibles" },
            { status: 500 }
        )
    }
}
