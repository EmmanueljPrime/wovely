"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Lock,
  Bell,
  AlertTriangle,
  Save,
  Edit3,
  X
} from "lucide-react"

export default function SellerAccountSettings() {
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
              <h1 className="text-3xl font-bold mb-2">Paramètres du Compte</h1>
              <p className="text-teal-100 text-lg">
                Gérez vos préférences de compte et paramètres de sécurité
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Account Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 -mt-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <User className="h-6 w-6 text-teal-600" />
                Informations du compte
              </h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? "" : "bg-teal-600 hover:bg-teal-700"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </>
                )}
              </Button>
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
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-600" />
                  Nom d'utilisateur
                </Label>
                {isEditing ? (
                  <Input
                    id="username"
                    defaultValue={user?.username}
                    className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                ) : (
                  <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{user?.username}</span>
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

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-teal-600" />
              Paramètres de sécurité
            </h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-teal-600" />
                  Mot de passe actuel
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Entrez votre mot de passe actuel"
                  className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Entrez votre nouveau mot de passe"
                  className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre nouveau mot de passe"
                  className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <Button className="bg-teal-600 hover:bg-teal-700">
                <Lock className="h-4 w-4 mr-2" />
                Mettre à jour le mot de passe
              </Button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Bell className="h-6 w-6 text-teal-600" />
              Préférences de notification
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Notifications par email</p>
                  <p className="text-sm text-gray-600">Recevez des notifications sur les commandes et messages</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Notifications SMS</p>
                  <p className="text-sm text-gray-600">Recevez les notifications urgentes par SMS</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Emails marketing</p>
                  <p className="text-sm text-gray-600">Recevez les emails promotionnels et mises à jour</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Zone de danger
            </h2>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Supprimer le compte</h4>
              <p className="text-sm text-red-700 mb-4">
                Une fois votre compte supprimé, il n'y a pas de retour en arrière possible. Soyez certain de votre choix.
              </p>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Supprimer le compte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
