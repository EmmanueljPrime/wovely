"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import RelatedProducts from "@/components/relatedProducts"

type Params = {
    params: { id: string }
}

type Product = {
    id: number
    name: string
    description: string
    price: number
    images: { url: string }[]
    category: { name: string }
    color: { name: string }
    material: { name: string }
    categoryId: string
    productStocks: {
        size: { id: string; name: string }
        quantity: number
    }[]
}

export default function ProductPageClient({ params }: Params) {
    const [product, setProduct] = useState<Product | null>(null)
    const [selectedSizeId, setSelectedSizeId] = useState<string>("")
    const [stockForSize, setStockForSize] = useState<number | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`/api/products/${params.id}`)
            if (!res.ok) return
            const data = await res.json()
            setProduct(data)

            // Sélectionne la première taille automatiquement
            if (data.productStocks.length > 0) {
                setSelectedSizeId(data.productStocks[0].size.id)
                setStockForSize(data.productStocks[0].quantity)
            }
        }
        fetchProduct()
    }, [params.id])

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sizeId = e.target.value
        setSelectedSizeId(sizeId)

        const selectedStock = product?.productStocks.find(ps => ps.size.id === sizeId)
        setStockForSize(selectedStock?.quantity ?? null)
    }

    if (!product) return <div>Chargement...</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images produit */}
                <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <Image
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {product.images?.map((image, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                                <Image
                                    src={image.url || "/placeholder.svg"}
                                    alt={`${product.name} - Image ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Détails produit */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">{product.name}</h1>
                        <div className="flex items-center mt-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">(avis fictifs)</span>
                        </div>
                    </div>

                    <div>
                        <span className="text-2xl font-bold">{product.price} €</span>
                        <p className="text-sm text-gray-500 mt-1">
                            Taxe incluse. Livraison calculée à l'étape suivante.
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Stock disponible : <span className="font-medium">{stockForSize ?? "-"}</span>
                        </p>
                    </div>

                    {/* Sélecteur de taille */}
                    <div className="pt-2">
                        <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">
                            Taille
                        </label>
                        <select
                            id="size-select"
                            value={selectedSizeId}
                            onChange={handleSizeChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            {product.productStocks.map((ps) => (
                                <option key={ps.size.id} value={ps.size.id}>
                                    {ps.size.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button className="flex-1">Ajouter au panier</Button>
                        <Button variant="outline" className="flex-1">
                            Acheter maintenant
                        </Button>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Détails</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Catégorie : {product.category?.name || "Non spécifiée"}</li>
                            <li>Couleur : {product.color?.name || "Non spécifiée"}</li>
                            <li>Matière : {product.material?.name || "Non spécifiée"}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {product.categoryId && (
                <RelatedProducts currentProductId={product.id} categoryId={product.categoryId} />
            )}
        </div>
    )
}
