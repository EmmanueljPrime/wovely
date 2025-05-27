"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus } from "lucide-react"

export default function SellerCatalogs() {
  // Sample catalogs data
  const [catalogs, setCatalogs] = useState([
    {
      id: 1,
      name: "Catalog 1",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalArticles: "XXX",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 2,
      name: "Catalog 2",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalArticles: "XXX",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 3,
      name: "Catalog 3",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalArticles: "XXX",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      id: 4,
      name: "Catalog 4",
      description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      totalArticles: "XXX",
      image: "/placeholder.svg?height=150&width=150",
    },
  ])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Your Catalogs</h1>
        <Link href="/seller/catalogs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Catalog
          </Button>
        </Link>
      </div>

      {catalogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Your Catalog list is empty</h2>
          <p className="text-gray-500 max-w-md mb-6">
            Fill the catalog with products by adding your identifiers. You can always disable specific products, if
            you'd like.
          </p>
          <Link href="/seller/catalogs/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="flex gap-6 border-b pb-6">
              <div className="flex-shrink-0">
                <Image
                  src={catalog.image || "/placeholder.svg"}
                  alt={catalog.name}
                  width={150}
                  height={150}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-grow">
                <Link href={`/seller/catalogs/${catalog.id}`}>
                  <h3 className="text-lg font-semibold hover:underline">{catalog.name}</h3>
                </Link>
                <p className="text-gray-600 text-sm mt-2">{catalog.description}</p>
              </div>
              <div className="flex-shrink-0 self-center text-right">
                <p className="text-sm text-gray-500">Total Article :</p>
                <p className="font-medium">{catalog.totalArticles}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
