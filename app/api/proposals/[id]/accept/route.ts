import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const proposalId = parseInt(params.id)
    const userId = parseInt(session.user.id)

    // Récupérer le client
    const client = await prisma.client.findUnique({
      where: { userId }
    })

    if (!client) {
      return NextResponse.json(
        { error: "Profil client non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier que la proposition existe et appartient au client
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
        seller: {
          include: {
            user: true
          }
        }
      }
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition non trouvée ou déjà traitée" },
        { status: 404 }
      )
    }

    // Accepter la proposition
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "accepted" }
    })

    // Rejeter toutes les autres propositions du même projet
    await prisma.proposal.updateMany({
      where: {
        projectId: proposal.projectId,
        id: { not: proposalId },
        status: "pending"
      },
      data: { status: "rejected" }
    })

    // Créer une notification pour le vendeur
    await prisma.notification.create({
      data: {
        userId: proposal.seller.userId,
        content: `Votre proposition pour "${proposal.project.title}" a été acceptée ! En attente de paiement.`,
        readStatus: false
      }
    })

    return NextResponse.json({
      message: "Proposition acceptée avec succès",
      proposal: updatedProposal
    })

  } catch (error) {
    console.error("Erreur acceptation proposition:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'acceptation de la proposition" },
      { status: 500 }
    )
  }
}
