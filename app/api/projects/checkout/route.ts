import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const { proposalId } = await request.json()

    console.log("✅ Accepting proposal:", proposalId)

    // Validation des données d'entrée
    if (!proposalId || typeof proposalId !== 'number') {
      return NextResponse.json(
        { error: "ID de proposition invalide" },
        { status: 400 }
      )
    }

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

    // Récupérer la proposition avec toutes les données nécessaires
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        project: {
          clientId: client.id
        },
        status: "pending"
      },
      include: {
        project: {
          include: {
            client: {
              include: { user: true }
            }
          }
        },
        seller: {
          include: {
            user: true
          }
        }
      }
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition non trouvée ou vous n'êtes pas autorisé à l'accepter" },
        { status: 404 }
      )
    }

    // Vérifier qu'il n'y a pas déjà une proposition acceptée pour ce projet
    const existingAcceptedProposal = await prisma.proposal.findFirst({
      where: {
        projectId: proposal.project.id,
        status: "accepted"
      }
    })

    if (existingAcceptedProposal) {
      return NextResponse.json(
        { error: "Une proposition a déjà été acceptée pour ce projet" },
        { status: 400 }
      )
    }

    console.log("💳 Accepting proposal for:", {
      proposalId: proposal.id,
      projectId: proposal.project.id,
      sellerId: proposal.sellerId,
      clientId: client.id
    })

    // Transaction pour accepter la proposition
    await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le statut de la proposition
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: "accepted" }
      })

      // 2. Mettre à jour le statut du projet
      await tx.project.update({
        where: { id: proposal.project.id },
        data: {
          status: "accepted",
          sellerId: proposal.sellerId
        }
      })

      // 3. Créer une notification pour le vendeur
      await tx.notification.create({
        data: {
          userId: proposal.seller.userId,
          content: `🎉 Votre proposition pour le projet "${proposal.project.title}" a été acceptée ! Organisez le paiement directement avec le client. Montant : ${proposal.price}€`,
          readStatus: false
        }
      })

      // 4. Créer une notification pour le client
      await tx.notification.create({
        data: {
          userId: proposal.project.client.userId,
          content: `✅ Vous avez accepté la proposition de ${proposal.seller.user.username} pour le projet "${proposal.project.title}". Organisez le paiement directement avec le vendeur. Montant : ${proposal.price}€`,
          readStatus: false
        }
      })

      console.log("✅ Proposal accepted successfully:", proposalId)
    })

    return NextResponse.json({
      success: true,
      message: "Proposition acceptée"
    })

  } catch (error) {
    console.error("❌ Error accepting proposal:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'acceptation de la proposition" },
      { status: 500 }
    )
  }
}
