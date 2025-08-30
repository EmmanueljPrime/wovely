"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Lock,
  // Bell,
  AlertTriangle,
  Save,
  Edit3,
  X,
  MapPin,
  FileText,
  Clock,
  Briefcase
} from "lucide-react"

export default function SellerAccountSettings() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const { toast } = useToast()

  // État pour les formulaires
  const [profileData, setProfileData] = useState({
    businessName: "",
    fullName: "",
    phoneNumber: "",
    servicesOffered: "",
    yearsOfExperience: "",
    // Champs pro
    companyType: "",
    siretNumber: "",
    companyAddress: "",
    companyCity: "",
    companyPostalCode: "",
    companyCountry: "",
    companyPhoneNumber: ""
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const response = await fetch('/api/seller/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        })
        setIsEditing(false)
        window.location.reload()
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors de la mise à jour",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch('/api/seller/change-password', {
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
        toast({
          title: "Succès",
          description: "Mot de passe modifié avec succès",
        })
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors du changement de mot de passe",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive"
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)

    try {
      const response = await fetch('/api/seller/delete-account', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Compte supprimé",
          description: "Votre compte a été supprimé avec succès",
        })
        // Redirection vers la page d'accueil
        window.location.href = '/'
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors de la suppression",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive"
      })
    } finally {
      setIsDeletingAccount(false)
    }
  }

  // Déterminer si c'est un vendeur pro ou amateur
  const isProfessional = user?.seller?.companyType || user?.seller?.siretNumber

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
                  {isProfessional ? "Professionnel" : "Amateur"}
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
                {/* Champs communs */}
                <div>
                  <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    Nom de l'entreprise *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="businessName"
                      value={profileData.businessName}
                      onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                      placeholder={user?.seller?.business_name || "Nom de votre entreprise"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                      required
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.seller?.business_name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-600" />
                    Nom complet
                  </Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      placeholder={user?.seller?.fullName || "Votre nom complet"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.seller?.fullName || "Non renseigné"}</span>
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
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                      placeholder={user?.seller?.phoneNumber || "Votre numéro de téléphone"}
                      className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.seller?.phoneNumber || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    Années d'expérience
                  </Label>
                  {isEditing ? (
                    <Select value={profileData.yearsOfExperience} onValueChange={(value) => setProfileData({...profileData, yearsOfExperience: value})}>
                      <SelectTrigger className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                        <SelectValue placeholder={user?.seller?.yearsOfExperience || "Sélectionnez votre expérience"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 an</SelectItem>
                        <SelectItem value="2-5">2-5 ans</SelectItem>
                        <SelectItem value="6-10">6-10 ans</SelectItem>
                        <SelectItem value="11-20">11-20 ans</SelectItem>
                        <SelectItem value="20+">Plus de 20 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.seller?.yearsOfExperience || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="services" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-teal-600" />
                    Services offerts
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="services"
                      value={profileData.servicesOffered}
                      onChange={(e) => setProfileData({...profileData, servicesOffered: e.target.value})}
                      placeholder={user?.seller?.servicesOffered || "Décrivez les services que vous proposez..."}
                      className="rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <div className="min-h-[80px] p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{user?.seller?.servicesOffered || "Non renseigné"}</span>
                    </div>
                  )}
                </div>

                {/* Champs professionnels */}
                {isProfessional && (
                  <>
                    <div className="md:col-span-2">
                      <hr className="my-6" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-teal-600" />
                        Informations professionnelles
                      </h3>
                    </div>

                    <div>
                      <Label htmlFor="companyType" className="text-sm font-medium text-gray-700 mb-2">
                        Type d'entreprise
                      </Label>
                      {isEditing ? (
                        <Select value={profileData.companyType} onValueChange={(value) => setProfileData({...profileData, companyType: value})}>
                          <SelectTrigger className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                            <SelectValue placeholder={user?.seller?.companyType || "Sélectionnez le type d'entreprise"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SARL">SARL</SelectItem>
                            <SelectItem value="SAS">SAS</SelectItem>
                            <SelectItem value="EURL">EURL</SelectItem>
                            <SelectItem value="auto-entrepreneur">Auto-entrepreneur</SelectItem>
                            <SelectItem value="entreprise-individuelle">Entreprise individuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{user?.seller?.companyType || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="siret" className="text-sm font-medium text-gray-700 mb-2">
                        Numéro SIRET
                      </Label>
                      {isEditing ? (
                        <Input
                          id="siret"
                          value={profileData.siretNumber}
                          onChange={(e) => setProfileData({...profileData, siretNumber: e.target.value})}
                          placeholder={user?.seller?.siretNumber || "Numéro SIRET de votre entreprise"}
                          className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{user?.seller?.siretNumber || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        Adresse de l'entreprise
                      </Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          value={profileData.companyAddress}
                          onChange={(e) => setProfileData({...profileData, companyAddress: e.target.value})}
                          placeholder={user?.seller?.companyAddress || "Adresse complète de votre entreprise"}
                          className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{user?.seller?.companyAddress || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={profileData.companyCity}
                          onChange={(e) => setProfileData({...profileData, companyCity: e.target.value})}
                          placeholder={user?.seller?.companyCity || "Ville de votre entreprise"}
                          className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{user?.seller?.companyCity || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700 mb-2">
                        Code postal
                      </Label>
                      {isEditing ? (
                        <Input
                          id="postalCode"
                          value={profileData.companyPostalCode}
                          onChange={(e) => setProfileData({...profileData, companyPostalCode: e.target.value})}
                          placeholder={user?.seller?.companyPostalCode || "Code postal"}
                          className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{user?.seller?.companyPostalCode || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700 mb-2">
                        Pays
                      </Label>
                      {isEditing ? (
                        <Input
                          id="country"
                          value={profileData.companyCountry}
                          onChange={(e) => setProfileData({...profileData, companyCountry: e.target.value})}
                          placeholder={user?.seller?.companyCountry || "Pays"}
                          className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{user?.seller?.companyCountry || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="companyPhone" className="text-sm font-medium text-gray-700 mb-2">
                        Téléphone de l'entreprise
                      </Label>
                      {isEditing ? (
                        <Input
                          id="companyPhone"
                          type="tel"
                          value={profileData.companyPhoneNumber}
                          onChange={(e) => setProfileData({...profileData, companyPhoneNumber: e.target.value})}
                          placeholder={user?.seller?.companyPhoneNumber || "Téléphone de l'entreprise"}
                          className="h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                        />
                      ) : (
                        <div className="h-12 flex items-center px-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">{user?.seller?.companyPhoneNumber || "Non renseigné"}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
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
                Une fois votre compte supprimé, il n'y a pas de retour en arrière possible. Toutes vos données, produits et commandes seront définitivement perdus.
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
                      Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte vendeur
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
