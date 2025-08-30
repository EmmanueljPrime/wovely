"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// import { Switch } from "@/components/ui/switch"
import {
  Settings,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  // Bell,
  AlertTriangle,
  Save,
  Edit3,
  X,
  MapPin,
  Home
} from "lucide-react"

export default function ClientAccountSettings() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("CLIENT")
  const { update } = useSession() // Ajout pour forcer la mise à jour de la session
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // État pour les formulaires
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    address: "",
    postalCode: ""
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Effet pour initialiser les données du formulaire quand user change
  useEffect(() => {
    if (user?.client) {
      setProfileData({
        firstname: user.client.firstname || "",
        lastname: user.client.lastname || "",
        phoneNumber: user.client.phoneNumber || "",
        address: user.client.address || "",
        postalCode: user.client.postalCode || ""
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      console.log('Données envoyées:', profileData) // Debug

      const response = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const result = await response.json()
      console.log('Réponse API:', result) // Debug

      if (response.ok) {
        // Forcer la mise à jour de la session NextAuth
        await update()

        setIsEditing(false)

        // Plus de rechargement nécessaire grâce à la correction NextAuth !
      } else {
        console.error('Erreur lors de la mise à jour:', result.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error('Erreur:', error) // Debug
      console.error('Erreur de connexion')
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error('Les mots de passe ne correspondent pas')
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch('/api/client/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      })

      if (response.ok) {
        console.log('Mot de passe modifié avec succès')
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        const error = await response.json()
        console.error('Erreur lors du changement de mot de passe:', error.message || "Erreur lors du changement de mot de passe")
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)

    try {
      const response = await fetch('/api/client/delete-account', {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Compte supprimé avec succès')
        // Redirection vers la page d'accueil
        window.location.href = '/'
      } else {
        const error = await response.json()
        console.error('Erreur lors de la suppression:', error.message || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
    } finally {
      setIsDeletingAccount(false)
    }
  }

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
                <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                  Client
                </span>
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

            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstname" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-600" />
                    Prénom {!user?.client?.firstname && "*"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstname"
                      value={profileData.firstname}
                      onChange={(e) => setProfileData({...profileData, firstname: e.target.value})}
                      placeholder={user?.client?.firstname || "Votre prénom"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      required={!user?.client?.firstname}
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.client?.firstname || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastname" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-600" />
                    Nom {!user?.client?.lastname && "*"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastname"
                      value={profileData.lastname}
                      onChange={(e) => setProfileData({...profileData, lastname: e.target.value})}
                      placeholder={user?.client?.lastname || "Votre nom"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      required={!user?.client?.lastname}
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.client?.lastname || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-teal-600" />
                    Email
                  </Label>
                  <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
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
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                      placeholder={user?.client?.phoneNumber || "Votre numéro de téléphone"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.client?.phoneNumber || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4 text-teal-600" />
                    Adresse
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder={user?.client?.address || "Numéro et nom de rue"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.client?.address || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    Code postal
                  </Label>
                  {isEditing ? (
                    <Input
                      id="postalCode"
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                      placeholder={user?.client?.postalCode || "Code postal"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.client?.postalCode || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">
                    Membre depuis
                  </Label>
                  <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : "Non disponible"}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-teal-600" />
              Paramètres de sécurité
            </h2>

            <form onSubmit={handlePasswordChange}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-teal-600" />
                    Mot de passe actuel *
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Entrez votre mot de passe actuel"
                    className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe *
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Entrez votre nouveau mot de passe"
                    className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirmez votre nouveau mot de passe"
                    className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </form>
          </div>

          {/* Notification Preferences - Commenté pour plus tard */}
          {/*
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
          */}

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Zone de danger
            </h2>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Supprimer le compte</h4>
              <p className="text-sm text-red-700 mb-4">
                Une fois votre compte supprimé, il n'y a pas de retour en arrière possible. Toutes vos données, commandes et projets seront définitivement perdus.
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Supprimer le compte
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte client
                      et toutes les données associées de nos serveurs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : null}
                      Oui, supprimer mon compte
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
