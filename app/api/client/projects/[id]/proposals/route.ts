import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "CLIENT") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Awaiter params selon Next.js 15
    const resolvedParams = await params
    const projectId = Number(resolvedParams.id)
    if (isNaN(projectId)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    try {
        const userId = parseInt(session.user.id)
        const client = await prisma.client.findUnique({
            where: { userId }
        })

        if (!client) {
            return NextResponse.json({ error: "Profil client non trouvé" }, { status: 404 })
        }

        const proposals = await prisma.proposal.findMany({
            where: {
                projectId,
                project: {
                    clientId: client.id
                }
            },
            include: {
                seller: {
                    include: {
                        user: true
                    }
                }
                // Suppression de la relation order car elle n'existe pas dans le modèle Proposal
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const formatted = proposals.map(p => ({
            id: p.id,
            price: p.price.toString(),
            message: p.message,
            status: p.status,
            sellerId: p.sellerId,
            sellerName: p.seller?.business_name || p.seller?.fullName || p.seller?.user?.username || "Vendeur inconnu",
            created_at: p.created_at.toISOString(),
            updated_at: p.updated_at?.toISOString()
        }))

        return NextResponse.json({ proposals: formatted })
    } catch (err) {
        console.error("Erreur lors de la récupération des propositions :", err)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}