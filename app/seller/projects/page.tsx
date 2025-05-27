"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"

export default function SellerProjects() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (hasCorrectRole) {
      fetchAvailableProjects()
    }
  }, [hasCorrectRole])

  const fetchAvailableProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects/available")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error)
    } finally {
      setLoading(false)
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

  const filteredProjects = projects.filter((project: any) => {
    const matchesFilter = selectedFilter === "all" || project.category?.toLowerCase() === selectedFilter
    const matchesSearch =
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      open: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      closed: "bg-red-100 text-red-800",
    }
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.open
  }

  const handleSubmitProposal = async (projectId: number) => {
    // Rediriger vers une page de soumission d'offre
    window.location.href = `/seller/projects/${projectId}/proposal`
  }

  return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Projets Disponibles</h1>
          <p className="text-gray-600">Découvrez les projets proposés par les clients et déposez vos offres</p>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === "all" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Tous les projets
            </button>
            <button
                onClick={() => setSelectedFilter("suits")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === "suits" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Costumes
            </button>
            <button
                onClick={() => setSelectedFilter("dresses")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === "dresses" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Robes
            </button>
            <button
                onClick={() => setSelectedFilter("alterations")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === "alterations"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              Retouches
            </button>
          </div>

          <div className="flex gap-2">
            <input
                type="search"
                placeholder="Rechercher des projets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            />
            <button
                onClick={fetchAvailableProjects}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span className="ml-3 text-gray-600">Chargement des projets...</span>
            </div>
        ) : filteredProjects.length > 0 ? (
            <div className="space-y-6">
              {filteredProjects.map((project: any) => (
                  <div key={project.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                      {project.status === "open" ? "Ouvert" : project.status}
                    </span>
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {project.client?.name || "Client anonyme"}
                    </span>
                          {project.location && (
                              <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                                {project.location}
                      </span>
                          )}
                          {project.deadline && (
                              <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Deadline: {new Date(project.deadline).toLocaleDateString("fr-FR")}
                      </span>
                          )}
                          <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                            {project._count?.proposals || 0} offre(s) déposée(s)
                    </span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        {project.budget && <div className="text-lg font-semibold text-teal-600 mb-2">{project.budget}</div>}
                        {project.category && (
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {project.category}
                    </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Publié le {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                </span>
                      <div className="flex gap-2">
                        <button
                            onClick={() => (window.location.href = `/seller/projects/${project.id}`)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
                        >
                          Voir détails
                        </button>
                        <button
                            onClick={() => handleSubmitProposal(project.id)}
                            className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
                        >
                          Déposer une offre
                        </button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">Aucun projet disponible</p>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedFilter !== "all"
                    ? "Aucun projet ne correspond à vos critères de recherche."
                    : "Aucun projet n'a été publié par les clients pour le moment."}
              </p>
              {(searchTerm || selectedFilter !== "all") && (
                  <button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedFilter("all")
                      }}
                      className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
                  >
                    Voir tous les projets
                  </button>
              )}
            </div>
        )}
      </div>
  )
}
