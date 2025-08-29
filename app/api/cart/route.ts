import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Récupérer le panier
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
        { error: "Seuls les clients peuvent avoir un panier" },
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

    // Récupérer les articles du panier
    const cartItems = await prisma.cartItem.findMany({
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
        },
        size: true
      }
    })

    return NextResponse.json({
      success: true,
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)
    })

  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// POST - Ajouter un article au panier
export async function POST(request: NextRequest) {
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
        { error: "Seuls les clients peuvent ajouter des articles au panier" },
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

    const body = await request.json()
    const { productId, sizeId, quantity = 1 } = body

    if (!productId || !sizeId) {
      return NextResponse.json(
        { error: "ID du produit et taille requis" },
        { status: 400 }
      )
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        stockBySize: {
          where: { sizeId }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier le stock
    const stock = product.stockBySize.find(s => s.sizeId === sizeId)
    if (!stock || stock.quantity < quantity) {
      return NextResponse.json(
        { error: "Stock insuffisant" },
        { status: 400 }
      )
    }

    // Vérifier si l'article existe déjà dans le panier
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        clientId: client.id,
        productId: parseInt(productId),
        sizeId
      }
    })

    if (existingCartItem) {
      // Mettre à jour la quantité
      const newQuantity = existingCartItem.quantity + quantity

      if (stock.quantity < newQuantity) {
        return NextResponse.json(
          { error: "Stock insuffisant pour cette quantité" },
          { status: 400 }
        )
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      // Créer un nouvel article dans le panier
      await prisma.cartItem.create({
        data: {
          clientId: client.id,
          productId: parseInt(productId),
          sizeId,
          quantity
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Article ajouté au panier avec succès"
    })

  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
