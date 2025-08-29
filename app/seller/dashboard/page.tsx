"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import {
  BarChart3,
  Package,
  ShoppingBag,
  Euro,
  Users,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Clock,
  Star,
  Loader2
} from "lucide-react"

interface DashboardStats {
  products: {
    total: number
    totalStock: number
    lowStock: number
  }
  orders: {
    total: number
    pending: number
    delivered: number
    thisMonth: number
  }
  revenue: {
    total: number
    thisMonth: number
    averageOrder: number
  }
  proposals: {
    total: number
    accepted: number
    pending: number
    successRate: number
  }
  clients: {
    unique: number
  }
  recentOrders: Array<{
    id: number
    productName: string
    clientName: string
    amount: number
    status: string
    created_at: string
  }>
  topProducts: Array<{
    id: number
    name: string
    salesCount: number
    revenue: number
  }>
}

export default function SellerDashboard() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (hasCorrectRole) {
      fetchStats()
    }
  }, [hasCorrectRole])

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const response = await fetch("/api/seller/dashboard")

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.error || "Impossible de charger les statistiques",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des statistiques",
        variant: "destructive"
      })
    } finally {
      setLoadingStats(false)
    }
  }

  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short"
    })
  }

  if (isLoading || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!hasCorrectRole || !stats) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-full">
              <BarChart3 className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Dashboard Vendeur
              </h1>
              <p className="text-teal-100 text-lg">
                Bienvenue {user?.username} - {user?.seller?.business_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards - DESIGN ORIGINAL avec valeurs dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <ShoppingBag className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.orders.total}</h3>
            <p className="text-gray-600">Commandes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Euro className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">€{formatPrice(stats.revenue.total)}</h3>
            <p className="text-gray-600">Revenus</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.products.total}</h3>
            <p className="text-gray-600">Produits</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{stats.clients.unique}</h3>
            <p className="text-gray-600">Clients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders - DESIGN ORIGINAL avec données dynamiques */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-teal-600" />
                  Commandes récentes
                </h2>
                <Link href="/seller/orders">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir tout
                  </Button>
                </Link>
              </div>

              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Aucune commande pour le moment</p>
                  <p className="text-gray-400 mb-6">Vos futures commandes apparaîtront ici</p>
                  <Link href="/seller/catalogs">
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter des produits
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Commande #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.productName}</p>
                          <p className="text-xs text-gray-500">Par {order.clientName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-teal-600">{formatPrice(order.amount)} €</p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance Overview - SECTION STATIQUE CONSERVÉE */}
            {/*<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">*/}
            {/*  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">*/}
            {/*    <TrendingUp className="h-6 w-6 text-teal-600" />*/}
            {/*    Aperçu des performances*/}
            {/*  </h3>*/}

            {/*  <div className="grid md:grid-cols-3 gap-6">*/}
            {/*    <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">*/}
            {/*      <Star className="h-8 w-8 text-teal-600 mx-auto mb-2" />*/}
            {/*      <p className="text-2xl font-bold text-gray-900">5.0</p>*/}
            {/*      <p className="text-sm text-gray-600">Note moyenne</p>*/}
            {/*    </div>*/}
            {/*    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">*/}
            {/*      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />*/}
            {/*      <p className="text-2xl font-bold text-gray-900">2.1h</p>*/}
            {/*      <p className="text-sm text-gray-600">Temps de réponse</p>*/}
            {/*    </div>*/}
            {/*    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">*/}
            {/*      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />*/}
            {/*      <p className="text-2xl font-bold text-gray-900">94%</p>*/}
            {/*      <p className="text-sm text-gray-600">Satisfaction</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions - DESIGN ORIGINAL conservé */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
              <div className="space-y-3">
                <Link href="/seller/catalogs" className="w-full">
                  <Button className="w-full mb-2 bg-teal-600 hover:bg-teal-700 justify-start">
                    <Plus className="h-4 w-4 mr-3" />
                    Ajouter un produit
                  </Button>
                </Link>
                <Link href="/seller/orders" className="w-full">
                  <Button variant="outline" className="w-full mb-2 justify-start">
                    <ShoppingBag className="h-4 w-4 mr-3" />
                    Voir les commandes
                  </Button>
                </Link>
                <Link href="/seller/projects" className="w-full">
                  <Button variant="outline" className="w-full mb-2 justify-start">
                    <Package className="h-4 w-4 mr-3" />
                    Projets clients
                  </Button>
                </Link>
                <Link href="/seller/profile" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-3" />
                    Profil vendeur
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tips Section - DESIGN ORIGINAL conservé */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">💡 Conseils pour réussir</h3>
              <ul className="text-teal-100 text-sm space-y-2">
                <li>• Ajoutez des photos de qualité</li>
                <li>• Répondez rapidement aux messages</li>
                <li>• Décrivez précisément vos produits</li>
                <li>• Proposez des délais réalistes</li>
              </ul>
            </div>

            {/* Getting Started - DESIGN ORIGINAL avec logique dynamique */}
            {/*<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">*/}
            {/*  <h3 className="text-lg font-semibold text-gray-900 mb-3">Premiers pas</h3>*/}
            {/*  <div className="space-y-3 text-sm">*/}
            {/*    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">*/}
            {/*      <div className="w-2 h-2 bg-teal-600 rounded-full"></div>*/}
            {/*      <span className="text-gray-700">Profil complété</span>*/}
            {/*    </div>*/}
            {/*    <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg`}>*/}
            {/*      <div className={`w-2 h-2 rounded-full ${stats.products.total > 0 ? 'bg-teal-600' : 'bg-gray-300'}`}></div>*/}
            {/*      <span className={stats.products.total > 0 ? 'text-gray-700' : 'text-gray-500'}>*/}
            {/*        {stats.products.total > 0 ? `${stats.products.total} produit${stats.products.total > 1 ? 's' : ''} ajouté${stats.products.total > 1 ? 's' : ''}` : 'Ajoutez vos premiers produits'}*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*    <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg`}>*/}
            {/*      <div className={`w-2 h-2 rounded-full ${stats.orders.total > 0 ? 'bg-teal-600' : 'bg-gray-300'}`}></div>*/}
            {/*      <span className={stats.orders.total > 0 ? 'text-gray-700' : 'text-gray-500'}>*/}
            {/*        {stats.orders.total > 0 ? `${stats.orders.total} commande${stats.orders.total > 1 ? 's' : ''} reçue${stats.orders.total > 1 ? 's' : ''}` : 'Recevez votre première commande'}*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </div>
  )
}
