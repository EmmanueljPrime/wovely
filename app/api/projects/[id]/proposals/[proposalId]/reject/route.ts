import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
    req: NextRequest,
    context: { params: { id: string; proposalId: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "CLIENT") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const projectId = Number(context.params.id)
    const proposalId = Number(context.params.proposalId)

    if (isNaN(projectId) || isNaN(proposalId)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    try {
        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: {
                project: true,
            },
        })

        if (!proposal || proposal.project.clientId !== session.user.client?.id) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
        }

        const updated = await prisma.proposal.update({
            where: { id: proposalId },
            data: { status: "rejected" },
        })

        return NextResponse.json(updated, { status: 200 })
    } catch (error) {
        console.error("❌ Erreur de rejet :", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
