"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import {
  Package,
  Heart,
  ShoppingBag,
  Star,
  User,
  Mail,
  MapPin,
  Calendar,
  Euro,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Order {
  id: number
  created_at: string
  status: string
  total: number
  items: {
    id: number
    quantity: number
    price: number
    product: {
      id: number
      name: string
      images: { url: string }[]
    }
  }[]
}

export default function ClientAccountPage() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("CLIENT")
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    cartItems: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hasCorrectRole) {
      fetchOrders()
      fetchStats()
    }
  }, [hasCorrectRole])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/client/orders")
      if (!res.ok) throw new Error("Erreur lors du chargement des commandes")
      const data = await res.json()
      setOrders(data.slice(0, 3)) // Prendre seulement les 3 dernières
    } catch (err) {
      console.error("Erreur de chargement des commandes :", err)
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive"
      })
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/client/stats")
      if (!res.ok) throw new Error("Erreur lors du chargement des statistiques")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error("Erreur de chargement des statistiques :", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: JSX.Element }> = {
      pending: {
        label: "En attente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="h-4 w-4" />,
      },
      processing: {
        label: "En préparation",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Package className="h-4 w-4" />,
      },
      shipped: {
        label: "Expédiée",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <Truck className="h-4 w-4" />,
      },
      delivered: {
        label: "Livrée",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      cancelled: {
        label: "Annulée",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-4 w-4" />,
      },
    }
    return map[status] || {
      label: "Inconnue",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <Clock className="h-4 w-4" />,
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src={user?.image || "/placeholder-user.jpg"} />
              <AvatarFallback className="text-2xl bg-white text-teal-600">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Bonjour, {user?.username || "Client"} !
              </h1>
              <p className="text-teal-100 text-lg">
                Bienvenue dans votre espace personnel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            <p className="text-gray-600">Commandes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Euro className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSpent)}</h3>
            <p className="text-gray-600">Total dépensé</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <ShoppingBag className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.cartItems}</h3>
            <p className="text-gray-600">Dans le panier</p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes dernières commandes</h2>
            <Link href="/client/orders">
              <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                Voir toutes mes commandes
              </Button>
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

                return (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Commande #{order.id}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <Badge className={`${statusInfo.color} flex items-center gap-2`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </Badge>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-teal-600">
                              {formatPrice(order.total)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {totalItems} article{totalItems > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={item.product.images[0]?.url || "/placeholder.jpg"}
                                alt={item.product.name}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover border"
                              />
                              {item.quantity > 1 && (
                                <div className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {item.quantity}
                                </div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-15 h-15 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-gray-700">
                            {order.items[0].product.name}
                            {order.items.length > 1 && ` et ${order.items.length - 1} autre${order.items.length > 2 ? "s" : ""} article${order.items.length > 2 ? "s" : ""}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir les détails
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Aucune commande pour le moment
                </h3>
                <p className="text-gray-500 mb-6">
                  Découvrez notre catalogue et passez votre première commande
                </p>
                <Link href="/products">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Explorer les produits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-teal-600" />
                Mes commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Suivez l'état de vos commandes et votre historique d'achats
              </p>
              <Link href="/client/orders">
                <Button variant="outline" className="w-full text-teal-600 border-teal-600 hover:bg-teal-50">
                  Voir mes commandes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Mon profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gérez vos informations personnelles et vos préférences
              </p>
              <Link href="/client/settings">
                <Button variant="outline" className="w-full text-teal-600 border-teal-600 hover:bg-teal-50">
                  Modifier mon profil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
