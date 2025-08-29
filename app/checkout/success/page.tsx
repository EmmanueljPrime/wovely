"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface Order {
  id: number
  totalPrice: number
  status: string
}

export default function CheckoutSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [orderNumber, setOrderNumber] = useState<string>("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [processed, setProcessed] = useState(false)

  useEffect(() => {
    if (sessionId && !processed) {
      processOrder()
    }
  }, [sessionId, processed])

  const processOrder = async () => {
    try {
      setLoading(true)
      console.log("🔄 Traitement de la commande avec session:", sessionId)

      const response = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId })
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])

        // Générer un numéro de commande basé sur le timestamp
        const orderNum = `WOV-${Date.now().toString().slice(-6)}`
        setOrderNumber(orderNum)

        console.log("✅ Commande traitée avec succès:", data)

        toast({
          title: "Commande confirmée !",
          description: "Votre paiement a été traité et vos commandes ont été créées",
        })
      } else {
        const error = await response.json()
        console.error("❌ Erreur lors du traitement:", error)

        toast({
          title: "Erreur",
          description: error.error || "Erreur lors du traitement de la commande",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("❌ Erreur lors du traitement de la commande:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du traitement de la commande",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setProcessed(true)
    }
  }

  const calculateTotal = () => {
    return orders.reduce((sum, order) => sum + Number(order.totalPrice), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-16 w-16 text-teal-600 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Traitement de votre commande...
            </h2>
            <p className="text-gray-600">
              Nous finalisons votre paiement et créons vos commandes
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Paiement réussi !
          </CardTitle>
          <p className="text-gray-600">
            Votre commande a été confirmée et est en cours de traitement
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {orderNumber && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-1">
                Numéro de commande
              </h3>
              <p className="text-green-700 font-mono text-lg">
                {orderNumber}
              </p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Résumé de vos commandes
              </h3>
              <div className="space-y-2">
                {orders.map((order, index) => (
                  <div key={order.id} className="flex justify-between items-center">
                    <span className="text-gray-600">Commande #{index + 1}</span>
                    <span className="font-medium">{Number(order.totalPrice).toFixed(2)} €</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total payé</span>
                    <span className="text-teal-600">{calculateTotal().toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Que se passe-t-il ensuite ?</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Paiement confirmé</p>
                  <p className="text-sm text-gray-600">
                    Votre paiement a été traité avec succès via Stripe
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Préparation par le vendeur</p>
                  <p className="text-sm text-gray-600">
                    Le vendeur prépare votre commande et la met en cours d'expédition
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-500">Livraison</p>
                  <p className="text-sm text-gray-400">
                    Vous recevrez un suivi de livraison une fois votre commande expédiée
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 bg-teal-600 hover:bg-teal-700">
                <Link href="/client/orders">
                  <Package className="h-4 w-4 mr-2" />
                  Voir mes commandes
                </Link>
              </Button>

              <Button asChild variant="outline" className="flex-1">
                <Link href="/">
                  Continuer mes achats
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Besoin d'aide ? <Link href="/contact" className="text-teal-600 hover:text-teal-700 underline">Contactez-nous</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
