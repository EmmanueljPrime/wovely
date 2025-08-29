"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Briefcase, ArrowRight, Loader2, User, Euro, Calendar, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface ProjectPaymentDetails {
  order: {
    id: number
    totalPrice: number
    status: string
    paymentStatus: string
    created_at: string
  }
  project: {
    id: number
    title: string
    description: string
    status: string
  }
  seller: {
    business_name: string
    fullName: string
    user: {
      username: string
    }
  }
  proposal: {
    id: number
    price: number
    message: string
  }
}

export default function ProjectPaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentDetails, setPaymentDetails] = useState<ProjectPaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer les paramètres de l'URL
  const sessionId = searchParams.get("session_id")
  const projectId = searchParams.get("project_id")
  const paymentStatus = searchParams.get("payment")

  useEffect(() => {
    if (paymentStatus === "success" && projectId) {
      fetchPaymentDetails()
    } else if (paymentStatus === "cancelled") {
      setError("Le paiement a été annulé.")
      setLoading(false)
    } else {
      setError("Informations de paiement manquantes.")
      setLoading(false)
    }
  }, [paymentStatus, projectId])

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true)
      console.log("🔍 Récupération détails paiement pour projet:", projectId)

      const response = await fetch(`/api/client/projects/${projectId}/payment-success`)

      console.log("📡 Réponse API:", {
        status: response.status,
        ok: response.ok,
        url: response.url
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("❌ Erreur API:", errorData)
        throw new Error(`Erreur ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      console.log("✅ Données reçues:", data)
      setPaymentDetails(data)

    } catch (error) {
      console.error("❌ Erreur fetchPaymentDetails:", error)
      setError("Impossible de récupérer les détails du paiement. Le paiement peut encore être en cours de traitement.")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vérification du paiement...
          </h2>
          <p className="text-gray-600">
            Nous vérifions votre paiement, veuillez patienter.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="text-red-500 mb-4">
              <CheckCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Oups ! Une erreur s'est produite
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/client/projects">
                  Retour à mes projets
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/contact">
                  Contacter le support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!paymentDetails) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Hero Section de succès */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white/20 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Paiement réussi ! 🎉
          </h1>
          <p className="text-green-100 text-xl max-w-2xl mx-auto">
            Félicitations ! Votre paiement a été traité avec succès.
            Votre projet va maintenant commencer.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Récapitulatif du paiement */}
          <Card className="shadow-lg border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Euro className="h-6 w-6 text-green-600" />
                Récapitulatif du paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Montant payé</label>
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrice(paymentDetails.order.totalPrice)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Numéro de commande</label>
                    <p className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                      #WOV-{paymentDetails.order.id}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date de paiement</label>
                    <p className="text-lg">{formatDate(paymentDetails.order.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Payé
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        Projet en cours
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails du projet */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Briefcase className="h-6 w-6 text-teal-600" />
                Votre projet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {paymentDetails.project.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {paymentDetails.project.description.length > 200
                    ? `${paymentDetails.project.description.substring(0, 200)}...`
                    : paymentDetails.project.description
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informations vendeur */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <User className="h-6 w-6 text-blue-600" />
                Votre créateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-blue-900">
                      {paymentDetails.seller.business_name || paymentDetails.seller.fullName}
                    </h4>
                    <p className="text-blue-700">
                      @{paymentDetails.seller.user.username}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/client/messages?seller=${paymentDetails.seller.user.username}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prochaines étapes */}
          <Card className="shadow-lg bg-gradient-to-r from-teal-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Calendar className="h-6 w-6 text-teal-600" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Le créateur a été notifié</h4>
                    <p className="text-gray-600">Il va commencer à travailler sur votre projet immédiatement.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Suivi du projet</h4>
                    <p className="text-gray-600">Vous pouvez suivre l'avancement dans votre espace client.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Livraison</h4>
                    <p className="text-gray-600">Le créateur vous contactera pour la livraison finale.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/client/projects">
                <Briefcase className="h-4 w-4 mr-2" />
                Voir mes projets
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/client/orders">
                <ArrowRight className="h-4 w-4 mr-2" />
                Voir mes commandes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
