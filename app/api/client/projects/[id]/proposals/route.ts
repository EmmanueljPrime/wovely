import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "CLIENT") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const projectId = Number(params.id)
    if (isNaN(projectId)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    try {
        const proposals = await prisma.proposal.findMany({
            where: {
                projectId,
                project: {
                    clientId: session.user.client?.id
                }
            },
            include: {
                seller: {
                    select: {
                        fullName: true,
                        business_name: true,
                    }
                }
            }
        })

        const formatted = proposals.map(p => ({
            id: p.id,
            price: p.price.toString(),
            message: p.message,
            sellerId: p.sellerId,
            sellerName: p.seller?.business_name || p.seller?.fullName || "Couturier inconnu",
        }))

        return NextResponse.json({ proposals: formatted })
    } catch (err) {
        console.error("Erreur lors de la récupération des propositions :", err)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}