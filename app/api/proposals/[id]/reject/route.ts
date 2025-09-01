import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const proposalId = parseInt(resolvedParams.id)

    const userId = parseInt(session.user.id)
    const client = await prisma.client.findUnique({
      where: { userId }
    })

    if (!client) {
      return NextResponse.json(
        { error: "Profil client non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier que la proposition appartient bien au client
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        project: {
          clientId: client.id
        },
        status: "pending"
      },
      include: {
        project: true,
        seller: { include: { user: true } }
      }
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition non trouvée ou non autorisée" },
        { status: 404 }
      )
    }

    // Refuser la proposition
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "rejected" }
    })

    // Créer une notification pour le vendeur
    await prisma.notification.create({
      data: {
        userId: proposal.seller.userId,
        content: `❌ Votre proposition pour le projet "${proposal.project.title}" a été refusée.`,
        readStatus: false
      }
    })

    return NextResponse.json({
      success: true,
      message: "Proposition refusée"
    })

  } catch (error) {
    console.error("❌ Error rejecting proposal:", error)
    return NextResponse.json(
      { error: "Erreur lors du refus de la proposition" },
      { status: 500 }
    )
  }
}
