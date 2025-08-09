"use client"

import { useRequireRole } from "@/hooks/use-auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  Star
} from "lucide-react"

export default function SellerDashboard() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
    )
  }

  if (!hasCorrectRole) {
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
                Bienvenue {user?.name} - {user?.seller?.business_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-6 relative z-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <ShoppingBag className="h-8 w-8 text-teal-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-gray-600">Commandes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Euro className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">€0</h3>
            <p className="text-gray-600">Revenus</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-gray-600">Produits</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-gray-600">Clients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
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
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-teal-600" />
                Aperçu des performances
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                  <Star className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">5.0</p>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">-</p>
                  <p className="text-sm text-gray-600">Temps de réponse</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">0%</p>
                  <p className="text-sm text-gray-600">Croissance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
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

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">💡 Conseils pour réussir</h3>
              <ul className="text-teal-100 text-sm space-y-2">
                <li>• Ajoutez des photos de qualité</li>
                <li>• Répondez rapidement aux messages</li>
                <li>• Décrivez précisément vos produits</li>
                <li>• Proposez des délais réalistes</li>
              </ul>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Premiers pas</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <span className="text-gray-700">Complétez votre profil</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-500">Ajoutez vos premiers produits</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-500">Recevez votre première commande</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
