import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'CLIENT') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    // Supprimer toutes les données liées au client
    await prisma.$transaction(async (prisma) => {
      // 1. Récupérer toutes les commandes du client pour la suppression en cascade
      const orders = await prisma.order.findMany({
        where: { client: { userId } },
        select: { id: true }
      })

      const orderIds = orders.map(o => o.id)

      if (orderIds.length > 0) {
        // 2. Supprimer les éléments de commande
        await prisma.orderItem.deleteMany({
          where: { orderId: { in: orderIds } }
        })
      }

      // 3. Supprimer les éléments du panier
      await prisma.cartItem.deleteMany({
        where: { client: { userId } }
      })

      // 4. Supprimer les commandes en tant que client
      await prisma.order.deleteMany({
        where: { client: { userId } }
      })

      // 5. Supprimer les projets créés par le client
      const projects = await prisma.project.findMany({
        where: { client: { userId } },
        select: { id: true }
      })

      const projectIds = projects.map(p => p.id)

      if (projectIds.length > 0) {
        // 6. Supprimer les propositions liées aux projets du client
        await prisma.proposal.deleteMany({
          where: { projectId: { in: projectIds } }
        })
      }

      // 7. Supprimer les projets
      await prisma.project.deleteMany({
        where: { client: { userId } }
      })

      // 8. Supprimer les messages
      await prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { recipientId: userId }
          ]
        }
      })

      // 9. Supprimer les notifications
      await prisma.notification.deleteMany({
        where: { userId }
      })

      // 10. Supprimer le profil client
      await prisma.client.delete({
        where: { userId }
      })

      // 11. Supprimer les comptes liés (OAuth)
      await prisma.account.deleteMany({
        where: { userId }
      })

      // 12. Supprimer les sessions
      await prisma.session.deleteMany({
        where: { userId }
      })

      // 13. Finalement, supprimer l'utilisateur
      await prisma.user.delete({
        where: { id: userId }
      })
    })

    return NextResponse.json({
      message: 'Compte supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error)
    return NextResponse.json({
      message: 'Erreur interne du serveur'
    }, { status: 500 })
  }
}
