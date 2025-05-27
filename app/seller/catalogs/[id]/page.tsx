"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function CatalogDetail({ params }: { params: { id: string } }) {
  // Sample catalog data
  const [catalog, setCatalog] = useState({
    id: params.id,
    name: `Catalog ${params.id}`,
    articles: [
      {
        id: 1,
        name: "Article 1",
        description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        cost: "XXX",
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 2,
        name: "Article 2",
        description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        cost: "XXX",
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 3,
        name: "Article 3",
        description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        cost: "XXX",
        image: "/placeholder.svg?height=150&width=150",
      },
      {
        id: 4,
        name: "Article 4",
        description: "Description XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        cost: "XXX",
        image: "/placeholder.svg?height=150&width=150",
      },
    ],
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/seller/catalogs" className="text-sm text-teal-600 hover:underline mb-2 inline-block">
            ← Back to Catalogs
          </Link>
          <h1 className="text-xl font-semibold">{catalog.name}</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="space-y-6">
        {catalog.articles.map((article) => (
          <div key={article.id} className="flex gap-6 border-b pb-6">
            <div className="flex-shrink-0">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.name}
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{article.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{article.description}</p>
            </div>
            <div className="flex-shrink-0 self-center text-right">
              <p className="text-sm text-gray-500">Cost :</p>
              <p className="font-medium">{article.cost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
