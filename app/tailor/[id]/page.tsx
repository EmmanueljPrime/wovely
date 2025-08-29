import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Scissors, Shirt, Ruler, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default async function TailorPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const sellerIdFromSession = session?.user?.seller?.id

  const sellerId = Number(params.id)

  if (isNaN(sellerId)) return notFound()

  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: {
      user: true,
      products: {
        include: {
          category: true,
          images: true
        },
        orderBy: {
          created_at: 'desc'
        }
      }
    },
  })

  if (!seller) return notFound()

  const isOwner = seller.id === sellerIdFromSession

  // Calcul des statistiques réelles
  const totalProducts = seller.products.length
  const avgRating = 4.8 // À implémenter avec de vraies reviews plus tard
  const totalSales = 0 // À implémenter avec les vraies commandes plus tard

  const services = [
    { id: 1, name: "Couture", icon: <Scissors className="h-6 w-6 text-teal-600" /> },
    { id: 2, name: "Retouche", icon: <Shirt className="h-6 w-6 text-teal-600" /> },
    { id: 3, name: "Sur-mesure", icon: <Ruler className="h-6 w-6 text-teal-600" /> },
    { id: 4, name: "Broderie", icon: <Ruler className="h-6 w-6 text-teal-600" /> },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-12">
          {/*<div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-40 rounded-t-lg"></div>*/}
          <div className="flex flex-col items-center mt-15">
            <div className="relative">
              {/*<Image*/}
              {/*    src={seller.user.image || "/placeholder-user.jpg"}*/}
              {/*    alt={seller.user.username || "Profil"}*/}
              {/*    width={150}*/}
              {/*    height={150}*/}
              {/*    className="rounded-full border-4 border-white bg-white object-cover"*/}
              {/*/>*/}
            </div>
            <h1 className="text-3xl font-bold mt-4">{seller.user.username}</h1>
            <p className="text-gray-600 text-lg">{seller.business_name}</p>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-gray-600 text-sm">
              {seller.companyCity || "Localisation inconnue"}
            </span>
            </div>

            {/*<div className="flex justify-center gap-8 mt-6">*/}
            {/*  <div className="text-center">*/}
            {/*    <p className="text-2xl font-bold text-teal-600">{totalProducts}</p>*/}
            {/*    <p className="text-sm text-gray-600">Produits</p>*/}
            {/*  </div>*/}
            {/*  <div className="text-center">*/}
            {/*    <p className="text-2xl font-bold text-teal-600">{totalSales}</p>*/}
            {/*    <p className="text-sm text-gray-600">Ventes</p>*/}
            {/*  </div>*/}
            {/*  <div className="text-center">*/}
            {/*    <div className="flex items-center justify-center gap-1">*/}
            {/*      <Star className="h-4 w-4 text-yellow-400 fill-current" />*/}
            {/*      <p className="text-2xl font-bold text-teal-600">{avgRating}</p>*/}
            {/*    </div>*/}
            {/*    <p className="text-sm text-gray-600">Note</p>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {isOwner && (
                <Link href="/seller/profile">
                  <Button className="mt-6 bg-teal-600 text-white hover:bg-teal-700">
                    Modifier mon profil
                  </Button>
                </Link>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Services proposés</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service) => (
                <div key={service.id} className="text-center p-6 bg-white rounded-lg shadow-sm border">
                  <div className="mb-4 flex justify-center">{service.icon}</div>
                  <p className="font-medium">{service.name}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Produits ({totalProducts})</h2>
            {isOwner && (
              <Link href="/seller/catalogs">
                <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                  Gérer mes produits
                </Button>
              </Link>
            )}
          </div>

          {seller.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {seller.products.map((product) => {
                const mainImage = product.images[0] // Utiliser simplement la première image

                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                          src={mainImage?.url || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {product.category && (
                          <Badge className="absolute top-2 left-2 bg-white/90 text-gray-700">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <CardContent className="p-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-teal-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-teal-600">
                          {formatPrice(Number(product.price))}
                        </span>
                        <Link href={`/product/${product.id}`}>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {isOwner ? "Vous n'avez pas encore de produits" : "Aucun produit disponible"}
              </h3>
              <p className="text-gray-500 mb-6">
                {isOwner
                  ? "Commencez à créer votre catalogue pour attirer des clients"
                  : "Ce tailleur n'a pas encore ajouté de produits à son catalogue"
                }
              </p>
              {isOwner && (
                <Link href="/seller/catalogs">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Ajouter mon premier produit
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* About Section */}
        {/*<div className="mb-12">*/}
        {/*  <h2 className="text-2xl font-bold mb-6">À propos</h2>*/}
        {/*  <div className="bg-white p-6 rounded-lg shadow-sm border">*/}
        {/*    <p className="text-gray-700 leading-relaxed">*/}
        {/*      {seller.description ||*/}
        {/*        (isOwner*/}
        {/*          ? "Ajoutez une description de votre activité pour présenter vos services aux clients."*/}
        {/*          : "Aucune description disponible pour le moment."*/}
        {/*        )*/}
        {/*      }*/}
        {/*    </p>*/}
        {/*    /!*{isOwner && !seller.description && (*!/*/}
        {/*    /!*  <Link href="/seller/profile">*!/*/}
        {/*    /!*    <Button variant="outline" className="mt-4 text-teal-600 border-teal-600 hover:bg-teal-50">*!/*/}
        {/*    /!*      Ajouter une description*!/*/}
        {/*    /!*    </Button>*!/*/}
        {/*    /!*  </Link>*!/*/}
        {/*    /!*)}*!/*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
  )
}
