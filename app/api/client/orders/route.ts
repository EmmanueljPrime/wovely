import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Accès refusé - Clients uniquement" },
        { status: 403 }
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

    // Récupérer toutes les commandes du client
    const orders = await prisma.order.findMany({
      where: { clientId: client.id },
      include: {
        product: {
          include: {
            images: true,
            seller: {
              include: {
                user: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    console.log(`📦 ${orders.length} commandes trouvées pour le client ${client.id}`)

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentStatus: order.paymentStatus,
        created_at: order.created_at,
        updated_at: order.updated_at,
        product: {
          id: order.product.id,
          name: order.product.name,
          price: order.product.price,
          images: order.product.images,
          seller: {
            business_name: order.product.seller.business_name,
            user: {
              username: order.product.seller.user.username
            }
          }
        }
      }))
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
