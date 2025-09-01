"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Package, Calendar, Euro, User, Loader2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface Order {
  id: number
  quantity: number
  totalPrice: number
  status: string
  paymentStatus: string
  type: string
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    price: number
    images: { id: number; url: string }[]
    seller: {
      business_name: string
      user: {
        username: string
      }
    }
  }
  project?: {
    id: number
    title: string
    description: string
  }
  seller: {
    business_name: string
    user: {
      username: string
    }
  }
}

export default function ClientOrders() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/client/orders")

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de charger les commandes",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des commandes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmée", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
      shipped: { label: "Expédiée", variant: "default" as const, color: "bg-purple-100 text-purple-800" },
      delivered: { label: "Livrée", variant: "default" as const, color: "bg-green-100 text-green-800" },
      cancelled: { label: "Annulée", variant: "destructive" as const, color: "bg-red-100 text-red-800" }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      paid: { label: "Payé", color: "bg-green-100 text-green-800" },
      unpaid: { label: "Non payé", color: "bg-red-100 text-red-800" },
      refunded: { label: "Remboursé", color: "bg-gray-100 text-gray-800" }
    }

    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.unpaid

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const formatPrice = (price: number) => {
    return Number(price).toFixed(2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const calculateTotalSpent = () => {
    return orders.reduce((sum, order) => sum + Number(order.totalPrice), 0)
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="text-gray-600">Chargement de vos commandes...</span>
          </div>
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
            Retour à l'accueil
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
          <p className="text-gray-600 mt-1">
            Suivez l'état de vos commandes et votre historique d'achats
          </p>
        </div>
      </div>

      {/* Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-gray-600">Commandes passées</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Euro className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatPrice(calculateTotalSpent())} €</p>
              <p className="text-gray-600">Total dépensé</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(order => order.status === 'delivered').length}
              </p>
              <p className="text-gray-600">Commandes livrées</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des commandes */}
      {orders.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Aucune commande pour le moment
            </h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits et passez votre première commande !
            </p>
            <Link href="/">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Découvrir les produits
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Commande #{order.id}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Passée le {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex gap-6">
                  {/* Image du produit */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={order.product?.images[0]?.url || "/placeholder.svg"}
                        alt={order.product?.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Détails du produit */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {order.product ? order.product.name : order.project?.title}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-600">
                      {order.product && (
                        <>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Vendeur: {order.product.seller.business_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>Quantité: {order.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4" />
                            <span>Prix unitaire: {formatPrice(Number(order.product.price))} €</span>
                          </div>
                        </>
                      )}

                      {order.project && (
                        <div className="text-gray-700">
                          <p className="font-medium">Projet: {order.project.title}</p>
                          <p className="text-sm">{order.project.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prix total */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">
                      {formatPrice(Number(order.totalPrice))} €
                    </p>
                    <p className="text-sm text-gray-600">
                      Total
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Dernière mise à jour: {formatDate(order.updated_at)}
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/client/orders/${order.id}`}>
                      <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Voir détails
                      </Button>
                    </Link>

                    {order.product && (
                      <Link href={`/product/${order.product.id}`}>
                        <Button variant="outline" size="sm">
                          Voir le produit
                        </Button>
                      </Link>
                    )}

                    {order.project && (
                      <Link href={`/project/${order.project.id}`}>
                        <Button variant="outline" size="sm">
                          Voir le projet
                        </Button>
                      </Link>
                    )}

                    {order.status === 'delivered' && (
                      <Button size="sm" variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                        Laisser un avis
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
