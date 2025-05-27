"use client"

import { useRequireRole } from "@/hooks/use-auth"

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
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mon Compte Client</h1>
                <p className="text-gray-600">Bienvenue {user?.name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
                    <div className="space-y-2">
                        <p>
                            <strong>Nom:</strong> {user?.client?.firstname} {user?.client?.lastname}
                        </p>
                        <p>
                            <strong>Email:</strong> {user?.email}
                        </p>
                        <p>
                            <strong>Téléphone:</strong> {user?.client?.phone || "Non renseigné"}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Mes commandes</h3>
                    <p className="text-gray-500">Aucune commande pour le moment</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
                    <div className="space-y-2">
                        <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors">
                            Nouvelle commande
                        </button>
                        <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                            Modifier profil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
