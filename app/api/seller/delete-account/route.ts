import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SELLER') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const userId = parseInt(session.user.id)

    // Supprimer toutes les données liées au vendeur
    await prisma.$transaction(async (prisma) => {
      // 1. Récupérer tous les produits du vendeur pour la suppression en cascade
      const products = await prisma.product.findMany({
        where: { seller: { userId } },
        select: { id: true }
      })

      const productIds = products.map(p => p.id)

      if (productIds.length > 0) {
        // 2. Supprimer les stocks des produits
        await prisma.productStock.deleteMany({
          where: { productId: { in: productIds } }
        })

        // 3. Supprimer les images des produits
        await prisma.image.deleteMany({
          where: { productId: { in: productIds } }
        })

        // 4. Supprimer les éléments du panier liés aux produits du vendeur
        await prisma.cartItem.deleteMany({
          where: { productId: { in: productIds } }
        })

        // 5. Supprimer les éléments de commande liés aux produits
        await prisma.orderItem.deleteMany({
          where: { productId: { in: productIds } }
        })

        // 6. Maintenant supprimer les produits
        await prisma.product.deleteMany({
          where: { seller: { userId } }
        })
      }

      // 7. Supprimer les propositions
      await prisma.proposal.deleteMany({
        where: { seller: { userId } }
      })

      // 8. Supprimer les annonces
      await prisma.advert.deleteMany({
        where: { seller: { userId } }
      })

      // 9. Supprimer les commandes en tant que vendeur
      await prisma.order.deleteMany({
        where: { seller: { userId } }
      })

      // 10. Supprimer les projets où le vendeur est assigné
      await prisma.project.updateMany({
        where: { seller: { userId } },
        data: { sellerId: null }
      })

      // 11. Supprimer les messages
      await prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { recipientId: userId }
          ]
        }
      })

      // 12. Supprimer les notifications
      await prisma.notification.deleteMany({
        where: { userId }
      })

      // 13. Supprimer le profil vendeur
      await prisma.seller.delete({
        where: { userId }
      })

      // 14. Supprimer les comptes liés (OAuth)
      await prisma.account.deleteMany({
        where: { userId }
      })

      // 15. Supprimer les sessions
      await prisma.session.deleteMany({
        where: { userId }
      })

      // 16. Finalement, supprimer l'utilisateur
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
