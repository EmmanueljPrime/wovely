"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { ShoppingCart, Loader2 } from "lucide-react"

type Props = {
    productId: number
    productStocks: {
        size: { id: string; name: string }
        quantity: number
    }[]
}

export default function SizeSelector({ productId, productStocks }: Props) {
    const [selectedSizeId, setSelectedSizeId] = useState(productStocks[0]?.size.id || "")
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)

    const { data: session, status } = useSession()
    const router = useRouter()

    const selectedStock = productStocks.find(ps => ps.size.id === selectedSizeId)

    const handleAddToCart = async () => {
        // Cas 1: Pas connecté - rediriger vers l'inscription
        if (status === "loading") return

        if (!session) {
            toast({
                title: "Connexion requise",
                description: "Vous devez être connecté pour ajouter des articles au panier",
                variant: "destructive"
            })
            router.push("/auth/register")
            return
        }

        // Cas 2: Connecté en tant que vendeur - afficher un message d'erreur
        if (session.user.role === "SELLER") {
            toast({
                title: "Action non autorisée",
                description: "Les vendeurs ne peuvent pas acheter de produits",
                variant: "destructive"
            })
            return
        }

        // Cas 3: Connecté en tant que client - ajouter au panier
        if (session.user.role === "CLIENT") {
            setLoading(true)

            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: productId,
                        sizeId: selectedSizeId,
                        quantity: quantity
                    })
                })

                const data = await response.json()

                if (response.ok) {
                    toast({
                        title: "Article ajouté !",
                        description: "L'article a été ajouté à votre panier avec succès",
                    })
                } else {
                    throw new Error(data.error || "Erreur lors de l'ajout au panier")
                }
            } catch (error: any) {
                toast({
                    title: "Erreur",
                    description: error.message,
                    variant: "destructive"
                })
            } finally {
                setLoading(false)
            }
        }
    }

    const handleBuyNow = () => {
        // Pour l'instant, cette fonction fait la même chose qu'ajouter au panier
        // puis redirige vers le panier
        handleAddToCart().then(() => {
            if (session?.user.role === "CLIENT") {
                router.push("/cart")
            }
        })
    }

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Taille
                </label>
                <select
                    id="size-select"
                    value={selectedSizeId}
                    onChange={(e) => setSelectedSizeId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                    {productStocks.map(ps => (
                        <option key={ps.size.id} value={ps.size.id}>
                            {ps.size.name}
                        </option>
                    ))}
                </select>
                <p className="text-sm text-gray-600 mt-1">
                    Stock disponible : <span className="font-medium">{selectedStock?.quantity ?? "-"}</span>
                </p>
            </div>

            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité
                </label>
                <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    disabled={!selectedStock || selectedStock.quantity === 0}
                >
                    {Array.from({ length: Math.min(10, selectedStock?.quantity || 0) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    onClick={handleAddToCart}
                    disabled={loading || !selectedStock || selectedStock.quantity === 0}
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Ajout...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Ajouter au panier
                        </>
                    )}
                </Button>
                <Button
                    variant="outline"
                    onClick={handleBuyNow}
                    disabled={loading || !selectedStock || selectedStock.quantity === 0}
                    className="flex-1"
                >
                    Acheter maintenant
                </Button>
            </div>

            {(!selectedStock || selectedStock.quantity === 0) && (
                <p className="text-red-600 text-sm text-center">
                    Produit en rupture de stock
                </p>
            )}
        </div>
    )
}