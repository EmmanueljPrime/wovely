"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin, 
  Clock,
  Settings,
  Edit3,
  Save,
  X,
  Eye,
  Camera
} from "lucide-react"

export default function SellerProfile() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [isEditing, setIsEditing] = useState(false)

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
              <Settings className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Profil Vendeur</h1>
              <p className="text-teal-100 text-lg">
                Gérez vos informations professionnelles et paramètres
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Quick Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 -mt-6 relative z-10">
              {/* Camera button in top right corner */}
              <button className="absolute top-4 right-4 bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-teal-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h3>
                <p className="text-teal-600 font-medium mb-4">{user?.seller?.business_name}</p>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Modifier le profil
                      </>
                    )}
                  </Button>

                  {user?.seller?.id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(`/tailor/${user.seller.id}`, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir mon profil public
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profil complété</span>
                  <span className="font-semibold text-teal-600">75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Note moyenne</span>
                  <span className="font-semibold text-yellow-500">5.0 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-semibold text-gray-900">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <User className="h-6 w-6 text-teal-600" />
                  Informations personnelles
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    Nom de l'entreprise
                  </Label>
                  {isEditing ? (
                    <Input
                      id="businessName"
                      type="text"
                      defaultValue={user?.seller?.business_name}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.seller?.business_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-teal-600" />
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-teal-600" />
                    Téléphone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Votre numéro de téléphone"
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Non renseigné</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    Localisation
                  </Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      type="text"
                      placeholder="Ville, Pays"
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Non renseigné</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
                    Description de l'entreprise
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder="Décrivez votre entreprise, vos spécialités, votre savoir-faire..."
                      className="rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                    />
                  ) : (
                    <div className="min-h-[100px] p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Aucune description fournie</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>

            {/* Business Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Settings className="h-6 w-6 text-teal-600" />
                Paramètres professionnels
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessHours" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    Horaires de travail
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Sélectionnez vos horaires" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9-18">9h00 - 18h00</SelectItem>
                      <SelectItem value="8-20">8h00 - 20h00</SelectItem>
                      <SelectItem value="24-7">24h/24 - 7j/7</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="responseTime" className="text-sm font-medium text-gray-700 mb-2">
                    Temps de réponse moyen
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                      <SelectValue placeholder="Temps de réponse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Dans l'heure</SelectItem>
                      <SelectItem value="24h">Sous 24h</SelectItem>
                      <SelectItem value="48h">Sous 48h</SelectItem>
                      <SelectItem value="1w">Sous 1 semaine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Save className="h-4 w-4 mr-2" />
                  Mettre à jour les paramètres
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
