import {prisma} from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  const products = await prisma.product.findMany({
    take: 20,
    include: {
      images: true,
    },
    orderBy: { created_at: "desc" },
  })

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
                priority
              />
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-sm font-bold">{product.price.toString()} €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
