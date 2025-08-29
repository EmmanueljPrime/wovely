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

    if (session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Accès refusé - Vendeurs uniquement" },
        { status: 403 }
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

    // Récupérer toutes les commandes pour les produits du vendeur
    const orders = await prisma.order.findMany({
      where: { sellerId: seller.id },
      include: {
        product: {
          include: {
            images: true
          }
        },
        client: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    console.log(`📦 ${orders.length} commandes trouvées pour le vendeur ${seller.id}`)

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
          images: order.product.images
        },
        client: {
          firstname: order.client.firstname,
          lastname: order.client.lastname,
          email: order.client.user.email,
          phoneNumber: order.client.phoneNumber,
          address: order.client.address,
          postalCode: order.client.postalCode
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
