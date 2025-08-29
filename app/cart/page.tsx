"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingCart, ArrowLeft, Loader2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import getStripe from "@/lib/stripe"

interface CartItem {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    images: { url: string }[]
    seller: {
      user: {
        username: string
      }
    }
  }
  size: {
    id: string
    name: string
  }
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/login")
      return
    }

    if (session.user.role !== "CLIENT") {
      router.push("/")
      return
    }

    fetchCartItems()
  }, [session, status, router])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart")

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de charger le panier",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du panier",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (response.ok) {
        setCartItems(items =>
          items.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        )
        toast({
          title: "Quantité mise à jour",
          description: "La quantité a été modifiée avec succès"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de modifier la quantité",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: number) => {
    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setCartItems(items => items.filter(item => item.id !== itemId))
        toast({
          title: "Article supprimé",
          description: "L'article a été retiré de votre panier"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de supprimer l'article",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles à votre panier avant de procéder au paiement",
        variant: "destructive"
      })
      return
    }

    setProcessingPayment(true)

    try {
      // Créer la session Stripe Checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création du checkout")
      }

      const { sessionId, url } = await response.json()

      // Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        // Fallback avec Stripe.js
        const stripe = await getStripe()
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId })
          if (error) {
            throw new Error(error.message)
          }
        }
      }

    } catch (error: any) {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Impossible de procéder au paiement",
        variant: "destructive"
      })
    } finally {
      setProcessingPayment(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="text-gray-600">Chargement de votre panier...</span>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Votre panier est vide
              </h2>
              <p className="text-gray-600 mb-6">
                Découvrez nos produits et ajoutez vos articles préférés à votre panier.
              </p>
              <Link href="/">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continuer mes achats
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuer mes achats
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
        <div className="text-sm text-gray-600">
          ({cartItems.length} article{cartItems.length !== 1 ? 's' : ''})
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Articles du panier */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex items-center gap-4">
                    {/* Image produit */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.images[0]?.url || "/placeholder.svg"}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Détails produit */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Taille: {item.size.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Vendeur: {item.product.seller.user.username}
                      </p>
                      <p className="text-lg font-semibold text-teal-600 mt-1">
                        {formatPrice(Number(item.product.price))} €
                      </p>
                    </div>

                    {/* Contrôles quantité */}
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="font-medium w-8 text-center">
                        {updating === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sous-total */}
                    <div className="text-right min-w-[80px]">
                      <p className="font-semibold">
                        {formatPrice(Number(item.product.price) * item.quantity)} €
                      </p>
                    </div>

                    {/* Bouton supprimer */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé de commande */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(calculateSubtotal())} €</span>
              </div>

              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(calculateSubtotal())} €</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={processingPayment || cartItems.length === 0}
                className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-3"
              >
                {processingPayment ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Redirection vers Stripe...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payer avec Stripe
                  </div>
                )}
              </Button>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Paiement sécurisé par Stripe</span>
                </div>
                <p className="text-xs text-gray-500">
                  Taxes incluses. Livraison gratuite pour toutes les commandes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
