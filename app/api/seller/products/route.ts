import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    // Convertir l'ID utilisateur de string vers number
    const userId = parseInt(session.user.id)
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID utilisateur invalide" },
        { status: 400 }
      )
    }

    // Récupérer l'ID du seller
    const seller = await prisma.seller.findUnique({
      where: { userId: userId }
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Profil vendeur non trouvé" },
        { status: 404 }
      )
    }

    // Récupérer les produits du vendeur
    const products = await prisma.product.findMany({
      where: {
        sellerId: seller.id
      },
      include: {
        images: true,
        category: true,
        material: true,
        color: true,
        stockBySize: {
          include: {
            size: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      products
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
