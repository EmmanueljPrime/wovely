import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { unlink } from "fs/promises"
import path from "path"

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    console.log("🗑️ Début de la suppression de produit")

    const session = await getServerSession(authOptions)
    console.log("👤 Session récupérée:", { hasSession: !!session, role: session?.user?.role })

    if (!session || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    // Attendre les paramètres pour Next.js 15
    const params = await context.params
    const productId = parseInt(params.id)
    console.log("🔢 ID du produit:", { original: params.id, parsed: productId, isValid: !isNaN(productId) })

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID de produit invalide" },
        { status: 400 }
      )
    }

    // Convertir l'ID utilisateur de string vers number
    const userId = parseInt(session.user.id)
    console.log("👤 ID utilisateur:", { original: session.user.id, parsed: userId, isValid: !isNaN(userId) })

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
    console.log("🏪 Vendeur trouvé:", { found: !!seller, sellerId: seller?.id })

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
        orders: true,
        stockBySize: true
      }
    })
    console.log("📦 Produit récupéré:", {
      found: !!existingProduct,
      id: existingProduct?.id,
      name: existingProduct?.name,
      imagesCount: existingProduct?.images?.length || 0,
      stockCount: existingProduct?.stockBySize?.length || 0,
      ordersCount: existingProduct?.orders?.length || 0
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
    console.log("🛒 Commandes actives:", { count: activeOrders.length })

    if (activeOrders.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer ce produit car il y a des commandes en cours" },
        { status: 400 }
      )
    }

    console.log("🗑️ Début de la suppression en cascade")

    // Supprimer les stocks en premier (à cause de la foreign key)
    console.log("📊 Suppression des stocks...")
    await prisma.productStock.deleteMany({
      where: { productId: productId }
    })
    console.log("✅ Stocks supprimés")

    // Supprimer les images de la base de données
    console.log("🖼️ Suppression des images de la DB...")
    await prisma.image.deleteMany({
      where: { productId: productId }
    })
    console.log("✅ Images supprimées de la DB")

    // Supprimer les fichiers images du système de fichiers
    console.log("📁 Suppression des fichiers images...")
    for (const image of existingProduct.images) {
      try {
        const imagePath = path.join(process.cwd(), 'public', image.url)
        await unlink(imagePath)
        console.log(`✅ Fichier supprimé: ${image.url}`)
      } catch (fileError) {
        console.error(`❌ Erreur lors de la suppression du fichier image ${image.url}:`, fileError)
        // Continuer même si la suppression d'un fichier échoue
      }
    }

    // Maintenant supprimer le produit
    console.log("📦 Suppression du produit...")
    await prisma.product.delete({
      where: { id: productId }
    })
    console.log("✅ Produit supprimé avec succès")

    return NextResponse.json({
      success: true,
      message: "Produit supprimé avec succès"
    })

  } catch (error) {
    console.error("❌ Erreur lors de la suppression du produit:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
