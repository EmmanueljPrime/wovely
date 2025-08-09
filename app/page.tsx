import {prisma} from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"

interface HomeProps {
  searchParams: {
    category?: string
    material?: string
    size?: string
    color?: string
    search?: string
  }
}

export default async function Home({ searchParams }: HomeProps) {
  // Construire les filtres dynamiquement
  const where: any = {}

  if (searchParams.category) {
    where.category = {
      name: {
        contains: searchParams.category,
        mode: 'insensitive'
      }
    }
  }

  if (searchParams.material) {
    where.material = {
      name: {
        contains: searchParams.material,
        mode: 'insensitive'
      }
    }
  }

  if (searchParams.size) {
    where.size = {
      name: {
        contains: searchParams.size,
        mode: 'insensitive'
      }
    }
  }

  if (searchParams.color) {
    where.color = {
      name: {
        contains: searchParams.color,
        mode: 'insensitive'
      }
    }
  }

  if (searchParams.search) {
    where.OR = [
      {
        name: {
          contains: searchParams.search,
          mode: 'insensitive'
        }
      },
      {
        description: {
          contains: searchParams.search,
          mode: 'insensitive'
        }
      }
    ]
  }

  const products = await prisma.product.findMany({
    where,
    take: 20,
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
    },
    orderBy: { created_at: "desc" },
  })

  // Afficher les filtres actifs
  const activeFilters = Object.entries(searchParams).filter(([key, value]) =>
    value && ['category', 'material', 'size', 'color'].includes(key)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Affichage des filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Filtres actifs:</span>
            {activeFilters.map(([key, value]) => (
              <div key={key} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                {key}: {value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compteur de résultats */}
      <div className="mb-4">
        <p className="text-gray-600">
          {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille des produits */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <Link
              key={`product-${product.id}`}
              href={`/product/${product.id}`}
              className="group relative block rounded-lg transition-transform hover:scale-105"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.images[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-sm font-bold">{product.price.toString()} €</p>
                <p className="text-xs text-gray-500">Par {product.seller.business_name}</p>
                {/* Afficher les propriétés filtrées */}
                <div className="text-xs text-gray-500 mt-1">
                  {product.category && <span className="mr-2">#{product.category.name}</span>}
                  {product.material && <span className="mr-2">#{product.material.name}</span>}
                  {product.size && <span className="mr-2">{product.size.name}</span>}
                  {product.color && <span className="mr-2">{product.color.name}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit trouvé avec ces filtres.</p>
          <p className="text-gray-400 text-sm mt-2">Essayez de modifier ou supprimer certains filtres.</p>
        </div>
      )}
    </div>
  )
}
