"use client"

import { useRequireRole } from "@/hooks/use-auth"
import Link from "next/link"
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, Settings, Package, CreditCard, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ClientAccount() {
    const { user, isLoading, hasCorrectRole } = useRequireRole("CLIENT")

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    if (!hasCorrectRole) {
        return null // AuthGuard will handle redirection
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 p-4 rounded-full">
                            <User className="h-12 w-12" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Bonjour {user?.client?.firstname} !
                            </h1>
                            <p className="text-teal-100 text-lg">
                                Bienvenue dans votre espace personnel Wovely
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 -mt-6 relative z-10">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                        <Package className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900">0</h3>
                        <p className="text-gray-600">Commandes</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                        <Heart className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900">0</h3>
                        <p className="text-gray-600">Favoris</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                        <ShoppingBag className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900">0</h3>
                        <p className="text-gray-600">Dans le panier</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                        <Star className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900">5.0</h3>
                        <p className="text-gray-600">Satisfaction</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <User className="h-6 w-6 text-teal-600" />
                                    Informations personnelles
                                </h2>
                                <Link href="/client/settings">
                                    <Button variant="outline" size="sm">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Modifier
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Nom complet</p>
                                            <p className="font-medium text-gray-900">
                                                {user?.client?.firstname} {user?.client?.lastname}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Téléphone</p>
                                            <p className="font-medium text-gray-900">
                                                {user?.client?.phoneNumber || "Non renseigné"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Adresse</p>
                                            <p className="font-medium text-gray-900">
                                                {user?.client?.address || "Non renseignée"}
                                            </p>
                                            {user?.client?.postalCode && (
                                                <p className="text-sm text-gray-600">{user.client.postalCode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Package className="h-6 w-6 text-teal-600" />
                                    Mes dernières commandes
                                </h2>
                                <Link href="/client/orders">
                                    <Button variant="outline" size="sm">
                                        Voir tout
                                    </Button>
                                </Link>
                            </div>

                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">Aucune commande pour le moment</p>
                                <p className="text-gray-400 mb-6">Découvrez nos créateurs et passez votre première commande</p>
                                <Link href="/">
                                    <Button className="bg-teal-600 hover:bg-teal-700">
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        Commencer mes achats
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
                            <div className="space-y-3">
                                <Link href="/" className="w-full">
                                    <Button className="w-full mb-2 bg-teal-600 hover:bg-teal-700 justify-start">
                                        <ShoppingBag className="h-4 w-4 mr-3" />
                                        Explorer les produits
                                    </Button>
                                </Link>
                                <Link href="/client/favorites" className="w-full">
                                    <Button variant="outline" className="w-full mb-2 justify-start">
                                        <Heart className="h-4 w-4 mr-3" />
                                        Mes favoris
                                    </Button>
                                </Link>
                                <Link href="/client/cart" className="w-full">
                                    <Button variant="outline" className="w-full mb-2 justify-start">
                                        <ShoppingBag className="h-4 w-4 mr-3" />
                                        Mon panier
                                    </Button>
                                </Link>
                                <Link href="/client/settings" className="w-full">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Settings className="h-4 w-4 mr-3" />
                                        Paramètres
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
                            <h3 className="text-lg font-bold mb-3">Besoin d'aide ?</h3>
                            <p className="text-teal-100 mb-4 text-sm">
                                Notre équipe est là pour vous accompagner dans vos achats
                            </p>
                            <Link href="/public/contact">
                                <Button variant="secondary" size="sm" className="w-full">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Nous contacter
                                </Button>
                            </Link>
                        </div>

                        {/* Newsletter */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Restez informé</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Recevez nos dernières nouveautés et offres exclusives
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                                S'abonner à la newsletter
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
