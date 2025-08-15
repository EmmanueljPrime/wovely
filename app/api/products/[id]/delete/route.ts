import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { unlink } from "fs/promises"
import path from "path"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const productId = parseInt(params.id)
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID de produit invalide" },
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

    // Vérifier que le produit appartient au vendeur
    const seller = await prisma.seller.findUnique({
      where: { userId: userId }
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Profil vendeur non trouvé" },
        { status: 404 }
      )
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: seller.id
      },
      include: {
        images: true,
        orders: true
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier s'il y a des commandes en cours pour ce produit
    const activeOrders = existingProduct.orders.filter(
      order => order.status !== 'cancelled' && order.status !== 'delivered'
    )

    if (activeOrders.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer ce produit car il y a des commandes en cours" },
        { status: 400 }
      )
    }

    // Supprimer les fichiers images du système de fichiers
    for (const image of existingProduct.images) {
      try {
        const imagePath = path.join(process.cwd(), 'public', image.url)
        await unlink(imagePath)
      } catch (fileError) {
        console.error(`Erreur lors de la suppression du fichier image ${image.url}:`, fileError)
        // Continuer même si la suppression d'un fichier échoue
      }
    }

    // Supprimer le produit (les images et stocks seront supprimés en cascade)
    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({
      success: true,
      message: "Produit supprimé avec succès"
    })

  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
