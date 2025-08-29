import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Mettre à jour la quantité d'un article
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const params = await context.params
    const cartItemId = parseInt(params.id)

    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantité invalide" },
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

    // Vérifier que l'article appartient au client
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        clientId: client.id
      },
      include: {
        product: {
          include: {
            stockBySize: true
          }
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: "Article non trouvé dans le panier" },
        { status: 404 }
      )
    }

    // Vérifier le stock
    const stock = cartItem.product.stockBySize.find(s => s.sizeId === cartItem.sizeId)
    if (!stock || stock.quantity < quantity) {
      return NextResponse.json(
        { error: "Stock insuffisant" },
        { status: 400 }
      )
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    })

    return NextResponse.json({
      success: true,
      message: "Quantité mise à jour"
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un article du panier
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const params = await context.params
    const cartItemId = parseInt(params.id)

    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { error: "ID invalide" },
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

    // Vérifier que l'article appartient au client
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        clientId: client.id
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: "Article non trouvé dans le panier" },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    return NextResponse.json({
      success: true,
      message: "Article supprimé du panier"
    })

  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
