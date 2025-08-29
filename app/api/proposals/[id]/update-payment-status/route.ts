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
    const { projectId, paymentStatus } = await request.json()

    console.log("💰 Updating payment status for proposal:", proposalId, "to:", paymentStatus)

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

    // Transaction pour mettre à jour le statut de paiement
    await prisma.$transaction(async (tx) => {
      // 1. Mettre à jour le statut de la proposition
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: paymentStatus }
      })

      // 2. Si le paiement est marqué comme reçu, créer/mettre à jour la commande
      if (paymentStatus === "paid") {
        // Vérifier s'il y a déjà une commande pour ce projet
        const existingOrder = await tx.order.findFirst({
          where: {
            projectId: projectId,
            clientId: proposal.project.clientId,
            sellerId: seller.id
          }
        })

        if (!existingOrder) {
          // Créer la commande
          await tx.order.create({
            data: {
              quantity: 1,
              totalPrice: proposal.price,
              status: "accepted",
              paymentStatus: "paid",
              projectId: projectId,
              clientId: proposal.project.clientId,
              sellerId: seller.id
            }
          })
        } else {
          // Mettre à jour la commande existante
          await tx.order.update({
            where: { id: existingOrder.id },
            data: {
              paymentStatus: "paid",
              status: "accepted"
            }
          })
        }

        // 3. Mettre à jour le statut du projet si nécessaire
        await tx.project.update({
          where: { id: projectId },
          data: {
            status: "accepted",
            sellerId: seller.id
          }
        })

        // 4. Créer des notifications
        await tx.notification.create({
          data: {
            userId: proposal.seller.userId,
            content: `✅ Vous avez marqué le paiement du projet "${proposal.project.title}" comme reçu. Vous pouvez maintenant commencer le travail !`,
            readStatus: false
          }
        })

        await tx.notification.create({
          data: {
            userId: proposal.project.client.userId,
            content: `🎉 Le vendeur a confirmé avoir reçu votre paiement pour le projet "${proposal.project.title}". Le travail va commencer !`,
            readStatus: false
          }
        })
      }

      console.log("✅ Payment status updated successfully for proposal:", proposalId)
    })

    return NextResponse.json({
      success: true,
      message: "Statut de paiement mis à jour avec succès"
    })

  } catch (error) {
    console.error("❌ Error updating payment status:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de paiement" },
      { status: 500 }
    )
  }
}
