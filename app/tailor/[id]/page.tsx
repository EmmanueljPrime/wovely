import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Smartphone, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TailorProfilePage({ params }: { params: { id: string } }) {
  // Sample tailor data
  const tailor = {
    id: params.id,
    name: "Melissa Peters",
    specialty: "Specialty",
    location: "City, Country",
    followers: "67K",
    sales: "67",
    rating: "9.5/10",
    services: [
      { id: 1, name: "Services", icon: <Smartphone className="h-6 w-6" /> },
      { id: 2, name: "Services", icon: <Smartphone className="h-6 w-6" /> },
      { id: 3, name: "Services", icon: <Smartphone className="h-6 w-6" /> },
      { id: 4, name: "Services", icon: <Monitor className="h-6 w-6" /> },
      { id: 5, name: "Services", icon: <Monitor className="h-6 w-6" /> },
      { id: 6, name: "Services", icon: <Monitor className="h-6 w-6" /> },
    ],
    products: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: "Product Name",
      price: "XXX.00",
      image: "/placeholder.svg?height=200&width=200",
    })),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-12">
        <div className="bg-gray-100 h-40 rounded-t-lg"></div>
        <div className="flex flex-col items-center -mt-20">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt={tailor.name}
              width={150}
              height={150}
              className="rounded-full border-4 border-white bg-white"
            />
          </div>
          <h1 className="text-2xl font-bold mt-4">{tailor.name}</h1>
          <p className="text-gray-600">{tailor.specialty}</p>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-gray-600 text-sm">{tailor.location}</span>
          </div>

          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-xl font-bold">{tailor.followers}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{tailor.sales}</p>
              <p className="text-sm text-gray-600">Sales</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{tailor.rating}</p>
              <p className="text-sm text-gray-600">Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {tailor.services.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 flex flex-col items-center justify-center text-center"
            >
              {service.icon}
              <p className="mt-2 text-sm">{service.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {tailor.products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full">
                    <Star className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
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
    </div>
  )
}
