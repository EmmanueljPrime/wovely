import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { optimizeImage, getOptimizedFileName } from "@/lib/image-optimization"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    console.log("✏️ Début de la modification de produit")

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
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    const formData = await request.formData()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const categoryId = formData.get('categoryId') as string
    const materialId = formData.get('materialId') as string
    const sizeId = formData.get('sizeId') as string
    const colorId = formData.get('colorId') as string
    const stock = parseInt(formData.get('stock') as string) || 0

    // Validation
    if (!name || !price || !categoryId || !materialId || !sizeId || !colorId) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être supérieur à 0" },
        { status: 400 }
      )
    }

    // Traitement des nouvelles images
    const newImages = formData.getAll('newImages') as File[]
    const imageUrls: string[] = []

    if (newImages.length > 0) {
      const timestamp = Date.now()

      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i]

        if (file.size === 0) continue

        try {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)

          // Optimiser l'image
          const optimizedBuffer = await optimizeImage(buffer, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 80,
            maxSizeKB: 500
          })

          // Générer le nom de fichier
          const fileName = getOptimizedFileName(file.name, timestamp, i)
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')

          // Créer le dossier s'il n'existe pas
          await mkdir(uploadDir, { recursive: true })

          const filePath = path.join(uploadDir, fileName)
          await writeFile(filePath, optimizedBuffer)

          imageUrls.push(`/uploads/products/${fileName}`)
        } catch (imageError) {
          console.error('Erreur lors du traitement de l\'image:', imageError)
          // Continuer avec les autres images même si une échoue
        }
      }
    }

    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        categoryId,
        materialId,
        sizeId,
        colorId,
        updated_at: new Date()
      },
      include: {
        images: true,
        category: true,
        material: true,
        size: true,
        color: true
      }
    })

    // Ajouter les nouvelles images si il y en a
    if (imageUrls.length > 0) {
      await prisma.image.createMany({
        data: imageUrls.map(url => ({
          url,
          productId: productId
        }))
      })
    }

    // Mettre à jour le stock
    if (stock >= 0) {
      // Chercher d'abord si un stock existe déjà pour ce produit et cette taille
      const existingStock = await prisma.productStock.findFirst({
        where: {
          productId: productId,
          sizeId: sizeId
        }
      })

      if (existingStock) {
        // Mettre à jour le stock existant
        await prisma.productStock.update({
          where: { id: existingStock.id },
          data: { quantity: stock }
        })
      } else {
        // Créer un nouveau stock
        await prisma.productStock.create({
          data: {
            productId: productId,
            sizeId: sizeId,
            quantity: stock
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Produit mis à jour avec succès",
      product: updatedProduct
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
