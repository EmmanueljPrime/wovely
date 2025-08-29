"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Package, Calendar, Euro, User, Loader2, ShoppingBag, ArrowLeft, Phone, MapPin, Mail, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface Order {
  id: number
  quantity: number
  totalPrice: number
  status: string
  paymentStatus: string
  created_at: string
  updated_at: string
  product: {
    id: number
    name: string
    price: number
    images: { id: number; url: string }[]
  }
  client: {
    firstname: string
    lastname: string
    email: string
    phoneNumber?: string
    address?: string
    postalCode?: string
  }
}

export default function SellerOrders() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/login")
      return
    }

    if (session.user.role !== "SELLER") {
      router.push("/")
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/seller/orders")

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

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrder(orderId)
    try {
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setOrders(orders =>
          orders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
              : order
          )
        )
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la commande a été modifié avec succès"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de modifier le statut",
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
      setUpdatingOrder(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-800" },
      shipped: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
      delivered: { label: "Livrée", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" }
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

  const calculateTotalRevenue = () => {
    return orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + Number(order.totalPrice), 0)
  }

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(order => order.status === filterStatus)

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/seller/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tableau de bord
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des commandes</h1>
            <p className="text-gray-600 mt-1">
              Gérez les commandes de vos produits et mettez à jour leurs statuts
            </p>
          </div>
        </div>

        {/* Filtre par statut */}
        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les commandes</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="shipped">Expédiées</SelectItem>
              <SelectItem value="delivered">Livrées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-gray-600">Commandes totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Euro className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{formatPrice(calculateTotalRevenue())} €</p>
              <p className="text-gray-600">Chiffre d'affaires</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(order => order.status === 'pending').length}
              </p>
              <p className="text-gray-600">En attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(order => order.status === 'delivered').length}
              </p>
              <p className="text-gray-600">Livrées</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {filterStatus === "all" ? "Aucune commande pour le moment" : `Aucune commande ${filterStatus}`}
            </h2>
            <p className="text-gray-600 mb-6">
              {filterStatus === "all"
                ? "Les commandes de vos produits apparaîtront ici."
                : "Essayez de changer le filtre pour voir d'autres commandes."
              }
            </p>
            {filterStatus !== "all" && (
              <Button onClick={() => setFilterStatus("all")} variant="outline">
                Voir toutes les commandes
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Commande #{order.id}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Reçue le {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Informations produit */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={order.product.images[0]?.url || "/placeholder.svg"}
                          alt={order.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {order.product.name}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>Quantité: {order.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4" />
                          <span>Prix unitaire: {formatPrice(Number(order.product.price))} €</span>
                        </div>
                        <div className="font-semibold text-teal-600">
                          Total: {formatPrice(Number(order.totalPrice))} €
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations client */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Informations client</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{order.client.firstname} {order.client.lastname}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{order.client.email}</span>
                      </div>
                      {order.client.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{order.client.phoneNumber}</span>
                        </div>
                      )}
                      {order.client.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{order.client.address}, {order.client.postalCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Dernière mise à jour: {formatDate(order.updated_at)}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/product/${order.product.id}`}>
                      <Button variant="outline" size="sm">
                        Voir le produit
                      </Button>
                    </Link>

                    {/* Sélecteur de statut */}
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4 text-gray-500" />
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                        disabled={updatingOrder === order.id}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmée</SelectItem>
                          <SelectItem value="shipped">Expédiée</SelectItem>
                          <SelectItem value="delivered">Livrée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {updatingOrder === order.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
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
