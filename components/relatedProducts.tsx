"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

type RelatedProduct = {
    id: number
    name: string
    price: number
    images: { url: string }[]
}

export default function RelatedProducts({
                                            categoryId,
                                            currentProductId,
                                        }: {
    categoryId: string
    currentProductId: number
}) {
    const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])

    useEffect(() => {
        const load = async () => {
            const res = await fetch(
                `/api/products?category=${categoryId}&take=4`
            )
            if (res.ok) {
                const data: RelatedProduct[] = await res.json()
                const filtered = data.filter(p => p.id !== currentProductId)
                setRelatedProducts(filtered)
            }
        }
        load()
    }, [categoryId, currentProductId])

    if (relatedProducts.length === 0) return null

    return (
        <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                    <Link
                        href={`/product/${product.id}`}
                        key={product.id}
                        className="group"
                    >
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2">
                            <Image
                                src={product.images?.[0]?.url || "/placeholder.svg"}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="font-bold">{product.price} €</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}