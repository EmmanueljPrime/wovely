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

    // Récupérer les commandes du client avec les détails des produits
    const orders = await prisma.order.findMany({
      where: {
        clientId: clientId
      },
      include: {
        product: {
          include: {
            images: true
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

    // Grouper les commandes par date pour simuler des "commandes groupées"
    const groupedOrders = orders.reduce((acc, order) => {
      const dateKey = order.created_at.toISOString().split('T')[0]

      if (!acc[dateKey]) {
        acc[dateKey] = {
          id: order.id,
          created_at: order.created_at,
          status: order.status,
          items: [],
          total: 0
        }
      }

      acc[dateKey].items.push({
        id: order.id,
        quantity: order.quantity,
        price: Number(order.totalPrice),
        product: order.product || {
          id: order.projectId || 0,
          name: order.project?.title || "Projet sur-mesure",
          images: []
        }
      })

      acc[dateKey].total += Number(order.totalPrice)

      return acc
    }, {} as any)

    // Convertir en tableau et trier par date
    const formattedOrders = Object.values(groupedOrders).sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
