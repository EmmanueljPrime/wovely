import Image from "next/image"
import Link from "next/link"
import { Star, Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  // Sample favorite products
  const favoriteProducts = [
    {
      id: 1,
      name: "Gucci duffle bag",
      price: "$950",
      originalPrice: "$1150",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "BOE liquid CPU Cooler",
      price: "$190",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "GPT3 Shoulder USB Gamepad",
      price: "$350",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Quilted Satin Jacket",
      price: "$710",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  // Sample recommended products
  const recommendedProducts = [
    {
      id: 1,
      name: "ASUS PRO Gaming Laptop",
      price: "$950",
      originalPrice: "$1150",
      rating: 5,
      reviews: 55,
      image: "/placeholder.svg?height=200&width=200",
      isNew: false,
    },
    {
      id: 2,
      name: "IPS LCD Gaming Monitor",
      price: "$180",
      rating: 5,
      reviews: 55,
      image: "/placeholder.svg?height=200&width=200",
      isNew: false,
    },
    {
      id: 3,
      name: "HAVIT HV-G92 Gamepad",
      price: "$560",
      rating: 5,
      reviews: 55,
      image: "/placeholder.svg?height=200&width=200",
      isNew: true,
    },
    {
      id: 4,
      name: "AK-900 Wired Keyboard",
      price: "$200",
      rating: 5,
      reviews: 55,
      image: "/placeholder.svg?height=200&width=200",
      isNew: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Favorite (4)</h1>
        <Button variant="outline">Move All To Bag</Button>
      </div>

      {/* Favorite Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {favoriteProducts.map((product) => (
          <div key={product.id} className="group relative">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 left-2">
                <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">-25%</span>
              </div>
              <div className="absolute top-2 right-2">
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
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Link href={`/product/${product.id}`}>
                <h3 className="text-sm font-medium">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-bold text-red-500">{product.price}</p>
                {product.originalPrice && <p className="text-sm text-gray-500 line-through">{product.originalPrice}</p>}
              </div>
              <Button className="w-full mt-2 bg-black text-white hover:bg-gray-800">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add To Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Just For You</h2>
          <Button variant="outline">See All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
                {product.isNew && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">NEW</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full">
                    <Star className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Quick view</span>
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-sm font-medium">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-bold text-red-500">{product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">{product.originalPrice}</p>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-yellow-400" />
                      ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <Button className="w-full mt-2 bg-black text-white hover:bg-gray-800">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add To Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
