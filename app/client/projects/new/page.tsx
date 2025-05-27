"use client"

import type React from "react"

import { useRequireRole } from "@/hooks/use-auth"
import { useState } from "react"
import Link from "next/link"

export default function NewProject() {
    const { user, isLoading, hasCorrectRole } = useRequireRole("CLIENT")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
        location: "",
    })
    const [submitting, setSubmitting] = useState(false)

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch("/api/client/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                window.location.href = "/client/projects"
            } else {
                alert("Erreur lors de la création du projet")
            }
        } catch (error) {
            console.error("Erreur:", error)
            alert("Erreur lors de la création du projet")
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Link href="/client/projects" className="hover:text-teal-600">
                        Mes Projets
                    </Link>
                    <span>/</span>
                    <span>Nouveau Projet</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Créer un Nouveau Projet</h1>
                <p className="text-gray-600">Décrivez votre projet pour recevoir des offres de tailleurs qualifiés</p>
            </div>

            <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre du projet <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Ex: Costume sur mesure pour mariage"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description détaillée <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={6}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Décrivez en détail votre projet, vos attentes, les matériaux souhaités, etc."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="">Sélectionnez une catégorie</option>
                                    <option value="suits">Costumes</option>
                                    <option value="dresses">Robes</option>
                                    <option value="shirts">Chemises</option>
                                    <option value="pants">Pantalons</option>
                                    <option value="alterations">Retouches</option>
                                    <option value="accessories">Accessoires</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget estimé <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="budget"
                                    required
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Ex: €500 - €800"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date limite</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Ex: Paris, France"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <Link href="/client/projects">
                            <button
                                type="button"
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
                            >
                                Annuler
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-teal-600 text-white px-6 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            {submitting ? "Création..." : "Créer le projet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
