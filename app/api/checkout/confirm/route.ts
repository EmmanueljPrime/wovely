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

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID manquant" },
        { status: 400 }
      )
    }

    console.log("🔄 Traitement de la commande pour session:", sessionId)

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

    // Récupérer les articles du panier
    const cartItems = await prisma.cartItem.findMany({
      where: { clientId: client.id },
      include: {
        product: {
          include: {
            stockBySize: true
          }
        }
      }
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      )
    }

    console.log(`📦 ${cartItems.length} articles trouvés dans le panier`)

    // Créer les commandes pour chaque article
    const createdOrders = []
    for (const cartItem of cartItems) {
      const order = await prisma.order.create({
        data: {
          quantity: cartItem.quantity,
          totalPrice: Number(cartItem.product.price) * cartItem.quantity,
          status: "pending",
          paymentStatus: "paid",
          productId: cartItem.productId,
          clientId: client.id,
          sellerId: cartItem.product.sellerId
        }
      })

      createdOrders.push(order)

      // Décrémenter le stock
      const stock = cartItem.product.stockBySize.find(s => s.sizeId === cartItem.sizeId)
      if (stock) {
        await prisma.productStock.update({
          where: { id: stock.id },
          data: { quantity: Math.max(0, stock.quantity - cartItem.quantity) }
        })
        console.log(`📊 Stock mis à jour pour le produit ${cartItem.productId}`)
      }
    }

    // Vider le panier
    await prisma.cartItem.deleteMany({
      where: { clientId: client.id }
    })

    console.log(`✅ ${createdOrders.length} commandes créées avec succès`)
    console.log(`🗑️ Panier vidé pour le client ${client.id}`)

    return NextResponse.json({
      success: true,
      message: "Commandes créées avec succès",
      orders: createdOrders.map(order => ({
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status
      }))
    })

  } catch (error) {
    console.error("❌ Erreur lors du traitement de la commande:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
