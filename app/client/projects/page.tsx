"use client"

import Link from "next/link"
import { useRequireRole } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

type Project = {
    id: string
    title: string
    description: string
    deadline?: string
    created_at: string
    images: string[] // si tu veux les afficher plus tard
}

export default function ClientProjects() {
    const { user, isLoading, hasCorrectRole } = useRequireRole("CLIENT")
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/client/projects")
                const contentType = res.headers.get("content-type") || ""

                if (!res.ok || !contentType.includes("application/json")) {
                    const errorText = await res.text()
                    console.error("Réponse non JSON ou erreur serveur :", errorText)
                    throw new Error("Erreur serveur ou format inattendu")
                }

                const data = await res.json()
                setProjects(data.projects || [])
            } catch (error) {
                console.error("Erreur lors du chargement des projets", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    if (!hasCorrectRole) return null

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mes Projets</h1>
                    <p className="text-gray-600">Liste de vos projets déposés sur la plateforme</p>
                </div>
                <Link
                    href="/client/projects/new"
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                    + Nouveau projet
                </Link>
            </div>

            {loading ? (
                <p className="text-gray-600">Chargement...</p>
            ) : projects.length === 0 ? (
                <p className="text-gray-500">Vous n'avez pas encore créé de projet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                            <p className="text-sm text-gray-700 line-clamp-4">{project.description}</p>
                            {project.deadline && (
                                <p className="text-xs text-gray-400 mt-2">Livraison souhaitée : {project.deadline}</p>
                            )}
                            <p className="text-xs text-gray-400">
                                Créé le : {new Date(project.created_at).toLocaleDateString("fr-FR")}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}