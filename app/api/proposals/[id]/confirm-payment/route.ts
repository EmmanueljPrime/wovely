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

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const proposalId = parseInt(resolvedParams.id)
    const { projectId } = await request.json()

    console.log("💰 Confirming payment received for proposal:", proposalId, "project:", projectId)

    const userId = parseInt(session.user.id)
    const seller = await prisma.seller.findUnique({
      where: { userId }
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Profil vendeur non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier que la proposition appartient bien au vendeur
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: proposalId,
        sellerId: seller.id,
        status: { in: ["accepted", "waiting_payment"] }
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
          include: { user: true }
        }
      }
    })

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition non trouvée ou non autorisée" },
        { status: 404 }
      )
    }

    // Vérifier qu'il n'y a pas déjà une commande payée pour ce projet
    const existingOrder = await prisma.order.findFirst({
      where: {
        projectId: projectId,
        paymentStatus: "paid"
      }
    })

    if (existingOrder) {
      return NextResponse.json(
        { error: "Le paiement de ce projet a déjà été confirmé" },
        { status: 400 }
      )
    }

    // Transaction pour confirmer le paiement et créer la commande
    await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le statut de la proposition
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: "paid" }
      })

      // 2. Créer la commande (sans les champs problématiques)
      await tx.order.create({
        data: {
          quantity: 1,
          totalPrice: proposal.price,
          status: "in_progress",
          paymentStatus: "paid",
          projectId: projectId,
          clientId: proposal.project.clientId,
          sellerId: seller.id
        }
      })

      // 3. Mettre à jour le statut du projet
      await tx.project.update({
        where: { id: projectId },
        data: {
          status: "in_progress",
          sellerId: seller.id
        }
      })

      // 4. Créer une notification pour le vendeur
      await tx.notification.create({
        data: {
          userId: proposal.seller.userId,
          content: `✅ Vous avez confirmé le paiement reçu pour le projet "${proposal.project.title}". Le projet peut maintenant commencer !`,
          readStatus: false
        }
      })

      // 5. Créer une notification pour le client
      await tx.notification.create({
        data: {
          userId: proposal.project.client.userId,
          content: `🎉 Le vendeur a confirmé avoir reçu votre paiement ! Le projet "${proposal.project.title}" va maintenant commencer.`,
          readStatus: false
        }
      })

      console.log("✅ Payment confirmed successfully for proposal:", proposalId)
    })

    return NextResponse.json({
      success: true,
      message: "Paiement confirmé avec succès"
    })

  } catch (error) {
    console.error("❌ Error confirming payment:", error)
    return NextResponse.json(
      { error: "Erreur lors de la confirmation du paiement" },
      { status: 500 }
    )
  }
}
