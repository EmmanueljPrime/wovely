"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

type Product = {
  id: number
  name: string
  price: number
  images: { url: string }[]
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const material = searchParams.get("material")
  const color = searchParams.get("color")
  const size = searchParams.get("size")

  useEffect(() => {
    setProducts([])
    setPage(0)
    setHasMore(true)
  }, [category, material, color, size])

  useEffect(() => {
    if (loading) return

    const load = async () => {
      setLoading(true)

      const query = new URLSearchParams()
      query.set("take", "20")
      query.set("skip", String(page * 20))
      if (category) query.set("category", category)
      if (material) query.set("material", material)
      if (color) query.set("color", color)
      if (size) query.set("size", size)

      const res = await fetch(`/api/products?${query.toString()}`)
      if (!res.ok) {
        console.error("Erreur de chargement des produits")
        setLoading(false)
        return
      }

      const data: Product[] = await res.json()

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const filtered = data.filter((p) => !existingIds.has(p.id))
        return [...prev, ...filtered]
      })

      setHasMore(data.length === 20)
      setLoading(false)
    }

    load()
  }, [page, category, material, color, size])

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            setPage((prev) => prev + 1)
          }
        },
        { threshold: 1 }
    )

    const current = loaderRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [hasMore, loading])

  return (
      <div className="container mx-auto px-4 py-8">
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
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-sm font-bold">{product.price} €</p>
                </div>
              </Link>
          ))}
        </div>

        {loading && <div className="text-center text-gray-500 mt-6">Chargement...</div>}
        {!hasMore && !loading && (
            <div className="text-center text-gray-600 mt-6">
              ✅ Vous êtes arrivé au bout des annonces.
            </div>
        )}

        <div ref={loaderRef} className="h-10" />
      </div>
  )
}
