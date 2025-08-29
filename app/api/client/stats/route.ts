import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.client?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const clientId = session.user.client.id

    // Récupérer les statistiques
    const [orders, cartItems] = await Promise.all([
      // Commandes du client
      prisma.order.findMany({
        where: { clientId }
      }),
      // Articles dans le panier
      prisma.cartItem.findMany({
        where: { clientId }
      })
    ])

    // Calculer les statistiques
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) =>
      sum + Number(order.totalPrice), 0
    )

    const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const stats = {
      totalOrders,
      totalSpent,
      cartItems: cartItemsCount
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
