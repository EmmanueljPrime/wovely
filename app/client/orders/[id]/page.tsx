"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Package,
  Calendar,
  Euro,
  User,
  Loader2,
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Receipt
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

interface DetailedOrder {
  id: number
  quantity: number
  totalPrice: number
  status: string
  paymentStatus: string
  type: string
  stripeSessionId?: string
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    description: string
    price: number
    images: { id: number; url: string }[]
    category: { id: string; name: string } | null
    material: { id: string; name: string } | null
    color: { id: string; name: string } | null
    stockBySize: {
      quantity: number
      size: { id: string; name: string }
    }[]
    seller: {
      id: number
      business_name: string
      phoneNumber?: string
      user: {
        username: string
        email: string
      }
    }
  }
  project?: {
    id: number
    title: string
    description: string
    deadline?: string
    images: string[]
    client: {
      user: {
        username: string
        email: string
      }
    }
  }
  proposal?: {
    id: number
    price: number
    message: string
    status: string
  }
  seller: {
    id: number
    business_name: string
    phoneNumber?: string
    companyAddress?: string
    user: {
      username: string
      email: string
    }
  }
  client: {
    id: number
    firstname: string
    lastname: string
    phoneNumber?: string
    address?: string
    user: {
      username: string
      email: string
    }
  }
}

export default function ClientOrderDetails() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<DetailedOrder | null>(null)
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

    fetchOrderDetails()
  }, [session, status, router, orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/client/orders/${orderId}`)

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de charger les détails de la commande",
          variant: "destructive"
        })
        router.push("/client/orders")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des détails de la commande",
        variant: "destructive"
      })
      router.push("/client/orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pending: {
        label: "En attente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        description: "Votre commande est en attente de confirmation"
      },
      confirmed: {
        label: "Confirmée",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: CheckCircle,
        description: "Votre commande a été confirmée et est en préparation"
      },
      shipped: {
        label: "Expédiée",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Truck,
        description: "Votre commande a été expédiée"
      },
      delivered: {
        label: "Livrée",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        description: "Votre commande a été livrée avec succès"
      },
      cancelled: {
        label: "Annulée",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        description: "Cette commande a été annulée"
      }
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  const getPaymentStatusInfo = (paymentStatus: string) => {
    const statusConfig = {
      paid: { label: "Payé", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      unpaid: { label: "Non payé", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
      refunded: { label: "Remboursé", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Receipt }
    }

    return statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.unpaid
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

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="text-gray-600">Chargement des détails de la commande...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette commande n'existe pas ou vous n'avez pas l'autorisation de la voir.</p>
          <Link href="/client/orders">
            <Button className="bg-teal-600 hover:bg-teal-700">
              Retour à mes commandes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const paymentInfo = getPaymentStatusInfo(order.paymentStatus)
  const StatusIcon = statusInfo.icon
  const PaymentIcon = paymentInfo.icon

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/client/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux commandes
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commande #{order.id}</h1>
          <p className="text-gray-600 mt-1">
            Passée le {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statut de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Statut de la commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${statusInfo.color} text-sm px-3 py-1`}>
                    {statusInfo.label}
                  </Badge>
                  <p className="text-gray-600 mt-2">{statusInfo.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Dernière mise à jour</p>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails du produit/projet */}
          <Card>
            <CardHeader>
              <CardTitle>
                {order.product ? "Détails du produit" : "Détails du projet"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.product && (
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={order.product.images[0]?.url || "/placeholder.svg"}
                        alt={order.product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {order.product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{order.product.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Prix unitaire:</span>
                        <span className="ml-2 font-medium">{formatPrice(Number(order.product.price))} €</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantité:</span>
                        <span className="ml-2 font-medium">{order.quantity}</span>
                      </div>
                      {order.product.category && (
                        <div>
                          <span className="text-gray-500">Catégorie:</span>
                          <span className="ml-2 font-medium">{order.product.category.name}</span>
                        </div>
                      )}
                      {order.product.material && (
                        <div>
                          <span className="text-gray-500">Matériau:</span>
                          <span className="ml-2 font-medium">{order.product.material.name}</span>
                        </div>
                      )}
                      {order.product.color && (
                        <div>
                          <span className="text-gray-500">Couleur:</span>
                          <span className="ml-2 font-medium">{order.product.color.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {order.project && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {order.project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{order.project.description}</p>

                  {order.project.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Échéance: {formatDate(order.project.deadline)}</span>
                    </div>
                  )}

                  {order.project.images && order.project.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Images du projet:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {order.project.images.map((imageUrl, index) => (
                          <div key={index} className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={`Image ${index + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations sur le vendeur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du vendeur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{order.seller.business_name}</h4>
                  <p className="text-gray-600">@{order.seller.user.username}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{order.seller.user.email}</span>
                </div>

                {order.seller.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{order.seller.phoneNumber}</span>
                  </div>
                )}

                {order.seller.companyAddress && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{order.seller.companyAddress}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Résumé de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Résumé de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{formatPrice(Number(order.totalPrice))} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frais de livraison</span>
                  <span>Gratuit</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-teal-600">{formatPrice(Number(order.totalPrice))} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut du paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <PaymentIcon className="h-4 w-4" />
                <Badge className={paymentInfo.color}>
                  {paymentInfo.label}
                </Badge>
              </div>

              {order.stripeSessionId && (
                <p className="text-xs text-gray-500">
                  ID Stripe: {order.stripeSessionId}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.product && (
                <Link href={`/product/${order.product.id}`} className="block">
                  <Button variant="outline" className="w-full">
                    Voir le produit
                  </Button>
                </Link>
              )}

              {order.project && (
                <Link href={`/project/${order.project.id}`} className="block">
                  <Button variant="outline" className="w-full">
                    Voir le projet
                  </Button>
                </Link>
              )}

              {order.status === 'delivered' && (
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Laisser un avis
                </Button>
              )}

              {/*{order.paymentStatus === 'paid' && order.status !== 'cancelled' && (*/}
              {/*  <Button variant="outline" className="w-full">*/}
              {/*    Télécharger la facture*/}
              {/*  </Button>*/}
              {/*)}*/}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
