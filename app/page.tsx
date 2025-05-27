import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  // Sample product data
  const products = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: "Product Name",
    price: "XXX.00",
    image: "/placeholder.svg?height=300&width=300",
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full">
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Add to favorites</span>
                </Button>
              </div>
              <div className="absolute bottom-2 right-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="sr-only">Quick view</span>
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <Link href={`/product/${product.id}`}>
                <h3 className="text-sm font-medium">{product.name}</h3>
              </Link>
              <p className="text-sm font-bold">$ {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
