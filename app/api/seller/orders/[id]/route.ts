import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const params = await context.params
    const orderId = parseInt(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID de commande invalide" },
        { status: 400 }
      )
    }

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

    const body = await request.json()
    const { status: newStatus } = body

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      )
    }

    // Vérifier que la commande appartient au vendeur
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        sellerId: seller.id
      },
      include: {
        client: {
          include: {
            user: true
          }
        },
        product: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      )
    }

    // Mettre à jour le statut de la commande
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        updated_at: new Date()
      }
    })

    // Créer une notification pour le client
    const statusMessages = {
      confirmed: `Votre commande #${orderId} a été confirmée par le vendeur`,
      shipped: `Votre commande #${orderId} a été expédiée`,
      delivered: `Votre commande #${orderId} a été livrée`,
      cancelled: `Votre commande #${orderId} a été annulée`
    }

    if (statusMessages[newStatus as keyof typeof statusMessages]) {
      await prisma.notification.create({
        data: {
          content: statusMessages[newStatus as keyof typeof statusMessages],
          userId: order.client.user.id,
          readStatus: false
        }
      })
    }

    console.log(`✅ Statut de la commande ${orderId} mis à jour: ${newStatus}`)

    return NextResponse.json({
      success: true,
      message: "Statut mis à jour avec succès",
      order: updatedOrder
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
