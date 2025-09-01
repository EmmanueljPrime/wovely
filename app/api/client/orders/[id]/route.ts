import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
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

    // Attendre les paramètres pour Next.js 15
    const params = await context.params
    const orderId = parseInt(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "ID de commande invalide" },
        { status: 400 }
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

    // Récupérer la commande spécifique avec tous les détails
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        clientId: client.id
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            material: true,
            color: true,
            stockBySize: {
              include: {
                size: true
              }
            },
            seller: {
              include: {
                user: true
              }
            }
          }
        },
        project: {
          include: {
            client: {
              include: {
                user: true
              }
            }
          }
        },
        proposal: true,
        seller: {
          include: {
            user: true
          }
        },
        client: {
          include: {
            user: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: order
    })

  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
