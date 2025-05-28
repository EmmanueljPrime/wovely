"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import { useRouter } from "next/navigation"

export default function ClientSettings() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<"success" | "error" | "">("")

    // États pour les formulaires
    const [profileData, setProfileData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        agreeTerms: false,
        receiveAlerts: false,
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        language: "fr",
    })

    // Vérification d'accès
    useEffect(() => {
        if (status === "loading") return // Encore en chargement

        if (status === "unauthenticated") {
            router.push("/auth/login")
            return
        }

        if (session?.user?.role !== "CLIENT") {
            router.push("/unauthorized")
            return
        }
    }, [session, status, router])

    useEffect(() => {
        console.log("=== SESSION DEBUG ===")
        console.log("Session:", session)
        console.log("Session user:", session?.user)
        console.log("Session user createdAt:", session?.user?.createdAt)

        if (session?.user?.client) {
            setProfileData({
                firstname: session.user.client.firstname || "",
                lastname: session.user.client.lastname || "",
                email: session.user.email || "",
                phone: session.user.client.phoneNumber || "",
                address: session.user.client.address || "",
                city: session.user.client.city || "",
                postalCode: session.user.client.postalCode || "",
                country: session.user.client.country || "",
                agreeTerms: session.user.client.agreeTerms || false,
                receiveAlerts: session.user.client.receiveAlerts || false,
            })
        }
    }, [session])

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage(text)
        setMessageType(type)
        setTimeout(() => {
            setMessage("")
            setMessageType("")
        }, 5000)
    }

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/client/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData),
            })

            if (response.ok) {
                showMessage("Profil mis à jour avec succès", "success")
            } else {
                const error = await response.json()
                showMessage(error.error || "Erreur lors de la mise à jour", "error")
            }
        } catch (error) {
            showMessage("Erreur lors de la mise à jour", "error")
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage("Les mots de passe ne correspondent pas", "error")
            return
        }

        if (passwordData.newPassword.length < 6) {
            showMessage("Le mot de passe doit contenir au moins 6 caractères", "error")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/client/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            })

            if (response.ok) {
                showMessage("Mot de passe modifié avec succès", "success")
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            } else {
                const error = await response.json()
                showMessage(error.error || "Erreur lors du changement de mot de passe", "error")
            }
        } catch (error) {
            showMessage("Erreur lors du changement de mot de passe", "error")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch("/api/client/delete-account", {
                method: "DELETE",
            })

            if (response.ok) {
                window.location.href = "/"
            } else {
                const error = await response.json()
                showMessage(error.error || "Erreur lors de la suppression", "error")
            }
        } catch (error) {
            showMessage("Erreur lors de la suppression", "error")
        }
    }

    // Fonction pour formater la date de création
    const getCreationDate = () => {
        console.log("=== DEBUG DATE ===")
        console.log("Session user:", session?.user)
        console.log("Session user createdAt:", session?.user?.createdAt)
        console.log("Session user createdAt type:", typeof session?.user?.createdAt)

        // Priorité 1: Date de création de l'utilisateur (string ISO)
        if (session?.user?.createdAt) {
            try {
                const date = new Date(session.user.createdAt)
                console.log("Parsed date:", date)
                console.log("Is valid date:", !isNaN(date.getTime()))
                if (!isNaN(date.getTime())) {
                    const formatted = date.toLocaleDateString("fr-FR")
                    console.log("Formatted date:", formatted)
                    return formatted
                }
            } catch (error) {
                console.error("Erreur formatage date user:", error)
            }
        }

        // Priorité 2: Date de création du profil client
        if (session?.user?.client?.createdAt) {
            try {
                const date = new Date(session.user.client.createdAt)
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString("fr-FR")
                }
            } catch (error) {
                console.error("Erreur formatage date client:", error)
            }
        }

        console.log("No valid date found, returning fallback")
        return "Non disponible"
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    if (status === "unauthenticated" || session?.user?.role !== "CLIENT") {
        return null
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
            </div>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-md ${
                        messageType === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    {message}
                </div>
            )}

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                    <TabsTrigger value="preferences">Préférences</TabsTrigger>
                    <TabsTrigger value="account">Compte</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                            <CardDescription>Mettez à jour vos informations personnelles et votre adresse</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstname">Prénom</Label>
                                        <Input
                                            id="firstname"
                                            value={profileData.firstname}
                                            onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastname">Nom</Label>
                                        <Input
                                            id="lastname"
                                            value={profileData.lastname}
                                            onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="address">Adresse</Label>
                                    <Textarea
                                        id="address"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="city">Ville</Label>
                                        <Input
                                            id="city"
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postalCode">Code postal</Label>
                                        <Input
                                            id="postalCode"
                                            value={profileData.postalCode}
                                            onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Pays</Label>
                                        <Input
                                            id="country"
                                            value={profileData.country}
                                            onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={loading}>
                                    {loading ? "Mise à jour..." : "Mettre à jour le profil"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sécurité</CardTitle>
                            <CardDescription>Modifiez votre mot de passe pour sécuriser votre compte</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <Button type="submit" disabled={loading}>
                                    {loading ? "Modification..." : "Modifier le mot de passe"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle>Préférences</CardTitle>
                            <CardDescription>Configurez vos préférences de notifications et de langue</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Notifications</h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="emailNotifications">Notifications par email</Label>
                                        <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                                    </div>
                                    <Switch
                                        id="emailNotifications"
                                        checked={preferences.emailNotifications}
                                        onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="smsNotifications">Notifications SMS</Label>
                                        <p className="text-sm text-gray-500">Recevoir des notifications par SMS</p>
                                    </div>
                                    <Switch
                                        id="smsNotifications"
                                        checked={preferences.smsNotifications}
                                        onCheckedChange={(checked) => setPreferences({ ...preferences, smsNotifications: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="marketingEmails">Emails marketing</Label>
                                        <p className="text-sm text-gray-500">Recevoir des offres et promotions</p>
                                    </div>
                                    <Switch
                                        id="marketingEmails"
                                        checked={preferences.marketingEmails}
                                        onCheckedChange={(checked) => setPreferences({ ...preferences, marketingEmails: checked })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Langue</h3>
                                <div>
                                    <Label htmlFor="language">Langue préférée</Label>
                                    <select
                                        id="language"
                                        value={preferences.language}
                                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    >
                                        <option value="fr">Français</option>
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                    </select>
                                </div>
                            </div>

                            <Button>Sauvegarder les préférences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gestion du compte</CardTitle>
                            <CardDescription>Actions relatives à votre compte</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Informations du compte</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <p>
                                        <strong>Email:</strong> {session?.user?.email}
                                    </p>
                                    <p>
                                        <strong>Nom d'utilisateur:</strong> {session?.user?.name}
                                    </p>
                                    <p>
                                        <strong>Membre depuis:</strong> {getCreationDate()}
                                    </p>
                                    <p>
                                        <strong>Rôle:</strong> Client
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-red-600">Zone de danger</h3>
                                <div className="border border-red-200 rounded-md p-4">
                                    <h4 className="font-medium text-red-800 mb-2">Supprimer le compte</h4>
                                    <p className="text-sm text-red-600 mb-4">
                                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                                    </p>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Supprimer mon compte</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte et toutes
                                                    vos données de nos serveurs.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                                    Supprimer définitivement
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
