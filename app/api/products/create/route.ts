import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { optimizeImage, getOptimizedFileName } from "@/lib/image-optimization"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session utilisateur:", session?.user)

    if (!session || session.user.role !== "SELLER") {
      console.log("Accès non autorisé - session:", !!session, "role:", session?.user?.role)
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      )
    }

    // Récupérer le seller associé à l'utilisateur
    const seller = await prisma.seller.findUnique({
      where: { userId: parseInt(session.user.id) }
    })
    console.log("Seller trouvé:", !!seller, seller?.id)

    if (!seller) {
      return NextResponse.json(
        { error: "Profil vendeur non trouvé" },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    console.log("FormData reçue, clés:", Array.from(formData.keys()))

    // Extraire les données du formulaire
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string) || 0
    const categoryId = formData.get('categoryId') as string
    const materialId = formData.get('materialId') as string
    const sizeId = formData.get('sizeId') as string
    const colorId = formData.get('colorId') as string

    console.log("Données extraites:", {
      name, description, price, stock, categoryId, materialId, sizeId, colorId
    })

    // Validation des données
    if (!name || !price || !categoryId || !materialId || !sizeId || !colorId) {
      console.log("Validation échouée - données manquantes:", {
        name: !!name,
        price: !!price,
        categoryId: !!categoryId,
        materialId: !!materialId,
        sizeId: !!sizeId,
        colorId: !!colorId
      })
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      )
    }

    // Traitement des images avec optimisation
    const images = formData.getAll('images') as File[]
    console.log("Images reçues:", images.length)

    if (images.length === 0) {
      console.log("Aucune image fournie")
      return NextResponse.json(
        { error: "Au moins une image est requise" },
        { status: 400 }
      )
    }

    // Créer le dossier de destination s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Le dossier existe déjà
    }

    // Sauvegarder et optimiser chaque image
    const timestamp = Date.now()
    const imageUrls: string[] = []

    for (let i = 0; i < images.length && i < 5; i++) {
      const image = images[i]

      try {
        // Convertir le fichier en buffer
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Optimiser l'image (redimensionner + convertir en WebP + réduire à 500kb max)
        const optimizedBuffer = await optimizeImage(buffer, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 85,
          maxSizeKB: 500
        })

        // Générer un nom de fichier optimisé
        const fileName = getOptimizedFileName(image.name, timestamp, i)
        const filePath = path.join(uploadDir, fileName)

        // Sauvegarder l'image optimisée
        await writeFile(filePath, optimizedBuffer)
        imageUrls.push(`/uploads/products/${fileName}`)

        console.log(`Image optimisée: ${fileName}, taille finale: ${Math.round(optimizedBuffer.length / 1024)}KB`)
      } catch (imageError) {
        console.error(`Erreur lors de l'optimisation de l'image ${i}:`, imageError)
        return NextResponse.json(
          { error: `Erreur lors du traitement de l'image ${i + 1}` },
          { status: 400 }
        )
      }
    }

    // Créer le produit en base de données
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price,
        sellerId: seller.id,
        categoryId,
        materialId,
        sizeId,
        colorId,
        images: {
          create: imageUrls.map((url) => ({
            url
          }))
        }
      },
      include: {
        images: true,
        category: true,
        material: true,
        size: true,
        color: true,
        seller: {
          include: {
            user: true
          }
        }
      }
    })

    // Si un stock a été fourni, créer une entrée ProductStock pour la taille sélectionnée
    if (stock > 0) {
      await prisma.productStock.create({
        data: {
          productId: product.id,
          sizeId: sizeId,
          quantity: stock
        }
      })
    }

    return NextResponse.json({
      message: "Produit créé avec succès",
      product,
      optimizedImages: imageUrls.length
    })

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du produit" },
      { status: 500 }
    )
  }
}
