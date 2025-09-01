import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

interface HomeProps {
    searchParams: Promise<{
        category?: string
        material?: string
        size?: string
        color?: string
        search?: string
    }>
}

// Composant de contenu principal
async function HomeContent({ searchParams }: HomeProps) {
    const params = await searchParams;

    // Construire les filtres dynamiquement
    const where: any = {}

    if (params.category) {
        where.category = {
            name: {
                contains: params.category,
                mode: 'insensitive'
            }
        }
    }

    if (params.material) {
        where.material = {
            name: {
                contains: params.material,
                mode: 'insensitive'
            }
        }
    }

    // Nouveau système pour les tailles utilisant ProductStock
    if (params.size) {
        where.stockBySize = {
            some: {
                size: {
                    name: {
                        contains: params.size,
                        mode: 'insensitive'
                    }
                },
                quantity: {
                    gt: 0 // Seulement les produits avec stock disponible
                }
            }
        }
    }

    if (params.color) {
        where.color = {
            name: {
                contains: params.color,
                mode: 'insensitive'
            }
        }
    }

    if (params.search) {
        where.OR = [
            {
                name: {
                    contains: params.search,
                    mode: 'insensitive'
                }
            },
            {
                description: {
                    contains: params.search,
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
            color: true,
            seller: {
                include: {
                    user: true
                }
            },
            stockBySize: {
                include: {
                    size: true
                },
                where: {
                    quantity: {
                        gt: 0 // Inclure seulement les stocks disponibles
                    }
                }
            }
        },
        orderBy: { created_at: "desc" },
    })

    // Afficher les filtres actifs
    const activeFilters = Object.entries(params).filter(([key, value]) =>
        value && ['category', 'material', 'color'].includes(key)
    )

    return (
        <div className="container mx-auto px-4 py-8">
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

            <div className="mb-4">
                <p className="text-gray-600">
                    {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
                </p>
            </div>

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
                                <div className="text-xs text-gray-500 mt-1">
                                    {product.category && <span className="mr-2">#{product.category.name}</span>}
                                    {product.material && <span className="mr-2">#{product.material.name}</span>}
                                    {product.stockBySize && product.stockBySize.length > 0 && (
                                        <span className="mr-2">
                                            Tailles: {product.stockBySize.map(stock => stock.size.name).join(', ')}
                                        </span>
                                    )}
                                    {product.color && <span className="mr-2">{product.color.name}</span>}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Essayez de modifier vos filtres ou votre recherche
                    </p>
                </div>
            )}
        </div>
    )
}

// Composant de fallback
function HomeLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Page principale avec Suspense
export default function Home({ searchParams }: HomeProps) {
    return (
        <Suspense fallback={<HomeLoading />}>
            <HomeContent searchParams={searchParams} />
        </Suspense>
    )
}