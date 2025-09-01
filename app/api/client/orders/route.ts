import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
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

    // Récupérer le profil client
    const client = await prisma.client.findUnique({
      where: { userId: userId }
    })

    if (!client) {
      return NextResponse.json(
        { error: "Profil client non trouvé" },
        { status: 404 }
      )
    }

    // Récupérer les commandes du client avec les détails des produits
    const orders = await prisma.order.findMany({
      where: {
        clientId: client.id
      },
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
        project: true,
        seller: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      orders: orders
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
