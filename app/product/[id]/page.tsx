import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function ProductPage({ params }: { params: { id: string } }) {
  // Sample product data
  const product = {
    id: params.id,
    name: "Product Name",
    price: "$550.00",
    originalPrice: "$650.00",
    discount: "15% OFF",
    rating: 4.5,
    reviews: 55,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies, nisl nunc ultricies nunc, quis ultricies nisl nunc quis ultricies.",
    features: [
      "Feature 1: Lorem ipsum dolor sit amet",
      "Feature 2: Consectetur adipiscing elit",
      "Feature 3: Sed euismod, diam quis aliquam ultricies",
    ],
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    colors: ["Black", "White", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    relatedProducts: [
      {
        id: 1,
        name: "Related Product 1",
        price: "$450.00",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 2,
        name: "Related Product 2",
        price: "$350.00",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 3,
        name: "Related Product 3",
        price: "$250.00",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        id: 4,
        name: "Related Product 4",
        price: "$150.00",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{product.price}</span>
              {product.originalPrice && <span className="text-gray-500 line-through">{product.originalPrice}</span>}
              {product.discount && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{product.discount}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className="border rounded-md px-3 py-1 text-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className="border rounded-md px-3 py-1 text-sm hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1">Add to Cart</Button>
              <Button variant="outline" className="flex-1">
                Buy Now
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="group">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-2">
                <Image
                  src={relatedProduct.image || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium">{relatedProduct.name}</h3>
              <p className="font-bold">{relatedProduct.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
