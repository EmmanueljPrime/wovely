import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import RelatedProducts from "@/components/relatedProducts"
import SizeSelector from "@/components/sizeSelector"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return notFound()

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      color: true,
      material: true,
      stockBySize: {
        include: { size: true },
      },
    },
  })

  if (!product) return notFound()

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
              <span className="text-2xl font-bold">{product.price.toString()} €</span>
              <p className="text-sm text-gray-500 mt-1">
                Taxe incluse. Livraison calculée à l'étape suivante.
              </p>
            </div>

            {/* Taille et stock */}
            <SizeSelector productStocks={product.stockBySize} />

            <div className="flex gap-4 pt-4">
              <Button className="flex-1">Ajouter au panier</Button>
              <Button variant="outline" className="flex-1">Acheter maintenant</Button>
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