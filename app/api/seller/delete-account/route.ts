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

    const userId = session.user.id

    // Supprimer toutes les données liées au vendeur
    await prisma.$transaction(async (prisma) => {
      // Supprimer les images des produits
      const products = await prisma.product.findMany({
        where: { seller: { userId } },
        include: { images: true }
      })

      for (const product of products) {
        await prisma.image.deleteMany({
          where: { productId: product.id }
        })
      }

      // Supprimer les éléments du panier liés aux produits du vendeur
      await prisma.cartItem.deleteMany({
        where: { product: { seller: { userId } } }
      })

      // Supprimer les produits
      await prisma.product.deleteMany({
        where: { seller: { userId } }
      })

      // Supprimer les propositions
      await prisma.proposal.deleteMany({
        where: { seller: { userId } }
      })

      // Supprimer les annonces
      await prisma.advert.deleteMany({
        where: { seller: { userId } }
      })

      // Supprimer les commandes en tant que vendeur
      await prisma.order.deleteMany({
        where: { seller: { userId } }
      })

      // Supprimer les projets où le vendeur est assigné
      await prisma.project.updateMany({
        where: { seller: { userId } },
        data: { sellerId: null }
      })

      // Supprimer les messages
      await prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { recipientId: userId }
          ]
        }
      })

      // Supprimer les notifications
      await prisma.notification.deleteMany({
        where: { userId }
      })

      // Supprimer le profil vendeur
      await prisma.seller.delete({
        where: { userId }
      })

      // Supprimer les comptes liés (OAuth)
      await prisma.account.deleteMany({
        where: { userId }
      })

      // Supprimer les sessions
      await prisma.session.deleteMany({
        where: { userId }
      })

      // Finalement, supprimer l'utilisateur
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
