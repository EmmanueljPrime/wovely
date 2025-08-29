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

    // Récupérer toutes les données nécessaires
    const [products, orders, proposals] = await Promise.all([
      // Produits du vendeur
      prisma.product.findMany({
        where: { sellerId: seller.id },
        include: {
          stockBySize: true,
          orders: true
        }
      }),

      // Commandes reçues
      prisma.order.findMany({
        where: { sellerId: seller.id },
        include: {
          product: true,
          client: {
            include: {
              user: true
            }
          }
        }
      }),

      // Propositions de projets
      prisma.proposal.findMany({
        where: { sellerId: seller.id },
        include: {
          project: {
            include: {
              client: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      })
    ])

    // Calculs des statistiques
    const totalProducts = products.length
    const totalStock = products.reduce((sum, product) =>
      sum + product.stockBySize.reduce((stockSum, stock) => stockSum + stock.quantity, 0), 0
    )

    const totalOrders = orders.length
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length

    const totalRevenue = orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + Number(order.totalPrice), 0)

    const monthlyRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.created_at)
        const now = new Date()
        return orderDate.getMonth() === now.getMonth() &&
               orderDate.getFullYear() === now.getFullYear() &&
               order.paymentStatus === 'paid'
      })
      .reduce((sum, order) => sum + Number(order.totalPrice), 0)

    // Statistiques des propositions
    const totalProposals = proposals.length
    const acceptedProposals = proposals.filter(proposal => proposal.status === 'accepted').length
    const pendingProposals = proposals.filter(proposal => proposal.status === 'pending').length

    // Commandes récentes (5 dernières)
    const recentOrders = orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        productName: order.product.name,
        clientName: `${order.client.user.username}`,
        amount: Number(order.totalPrice),
        status: order.status,
        created_at: order.created_at
      }))

    // Produits les plus vendus
    const productSales = orders.reduce((acc, order) => {
      if (order.paymentStatus === 'paid') {
        acc[order.productId] = (acc[order.productId] || 0) + order.quantity
      }
      return acc
    }, {} as Record<number, number>)

    const topProducts = products
      .map(product => ({
        id: product.id,
        name: product.name,
        salesCount: productSales[product.id] || 0,
        revenue: orders
          .filter(order => order.productId === product.id && order.paymentStatus === 'paid')
          .reduce((sum, order) => sum + Number(order.totalPrice), 0)
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)

    // Clients uniques
    const uniqueClients = new Set(orders.map(order => order.clientId)).size

    console.log(`📊 Statistiques calculées pour le vendeur ${seller.id}`)

    return NextResponse.json({
      success: true,
      stats: {
        products: {
          total: totalProducts,
          totalStock: totalStock,
          lowStock: products.filter(product =>
            product.stockBySize.reduce((sum, stock) => sum + stock.quantity, 0) <= 5
          ).length
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          delivered: deliveredOrders,
          thisMonth: orders.filter(order => {
            const orderDate = new Date(order.created_at)
            const now = new Date()
            return orderDate.getMonth() === now.getMonth() &&
                   orderDate.getFullYear() === now.getFullYear()
          }).length
        },
        revenue: {
          total: totalRevenue,
          thisMonth: monthlyRevenue,
          averageOrder: totalOrders > 0 ? totalRevenue / totalOrders : 0
        },
        proposals: {
          total: totalProposals,
          accepted: acceptedProposals,
          pending: pendingProposals,
          successRate: totalProposals > 0 ? (acceptedProposals / totalProposals) * 100 : 0
        },
        clients: {
          unique: uniqueClients
        },
        recentOrders,
        topProducts
      }
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
