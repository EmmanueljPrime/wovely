import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Scissors, Shirt, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function TailorPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const sellerIdFromSession = session?.user?.seller?.id

  const sellerId = Number(params.id)

  if (isNaN(sellerId)) return notFound()

  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: { user: true },
  })

  if (!seller) return notFound()

  const isOwner = seller.id === sellerIdFromSession

  // Données fictives pour la structure
  const services = [
    { id: 1, name: "Couture", icon: <Scissors className="h-6 w-6 text-teal-600" /> },
    { id: 2, name: "Retouche", icon: <Shirt className="h-6 w-6 text-teal-600" /> },
    { id: 3, name: "Sur-mesure", icon: <Ruler className="h-6 w-6 text-teal-600" /> },
    { id: 4, name: "Broderie", icon: <Ruler className="h-6 w-6 text-teal-600" /> },
  ]

  const products = [
    {
      id: 1,
      name: "Robe d'été",
      image: "/placeholder.svg",
      price: "89.99",
    },
    {
      id: 2,
      name: "Chemise en lin",
      image: "/placeholder.svg",
      price: "59.90",
    },
    {
      id: 3,
      name: "Jupe plissée",
      image: "/placeholder.svg",
      price: "49.00",
    },
  ]

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="bg-gray-100 h-40 rounded-t-lg"></div>
          <div className="flex flex-col items-center -mt-20">
            <div className="relative">
              <Image
                  src={seller.user.image || "/placeholder.svg?height=150&width=150"}
                  alt={seller.user.username || "Profil"}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-white bg-white object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold mt-4">{seller.user.username}</h1>
            <p className="text-gray-600">{seller.business_name}</p>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-gray-600 text-sm">
              {seller.companyCity || "Localisation inconnue"}
            </span>
            </div>

            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-xl font-bold">0</p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">0</p>
                <p className="text-sm text-gray-600">Sales</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold">10/10</p>
                <p className="text-sm text-gray-600">Rate</p>
              </div>
            </div>

            {isOwner && (
                <Link href="/seller/profile">
                  <Button className="mt-6 bg-teal-600 text-white hover:bg-teal-700">
                    Modifier mon profil
                  </Button>
                </Link>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {services.map((service) => (
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

        {/* Produits */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Produits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white rounded-full">
                        <Star className="h-4 w-4" />
                        <span className="sr-only">Ajouter aux favoris</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-sm font-medium">{product.name}</h3>
                    </Link>
                    <p className="text-sm font-bold">€ {product.price}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  )
}
