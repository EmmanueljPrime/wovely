import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "SELLER") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const projectId = Number(params.id)
    if (isNaN(projectId)) {
        return NextResponse.json({ error: "ID de projet invalide" }, { status: 400 })
    }

    const body = await req.json()
    const { price, message, advertId } = body

    if (!advertId) {
        return NextResponse.json({ error: "advertId requis" }, { status: 400 })
    }

    try {
        const proposal = await prisma.proposal.create({
            data: {
                price: parseFloat(price),
                message,
                projectId,
                advertId,
                sellerId: session.user.seller?.id!,
            },
        })

        return NextResponse.json(proposal, { status: 201 })
    } catch (error) {
        console.error("❌ Erreur création proposition :", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}