"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"

export default function SellerMyProjects() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("active")

  useEffect(() => {
    if (hasCorrectRole) {
      fetchMyProjects()
    }
  }, [hasCorrectRole])

  const fetchMyProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/seller/my-projects")
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

  const getStatusInfo = (status: string) => {
    const statusMap = {
      PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      IN_PROGRESS: { label: "En cours", color: "bg-blue-100 text-blue-800" },
      COMPLETED: { label: "Terminé", color: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Annulé", color: "bg-red-100 text-red-800" },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.PENDING
  }

  const filteredProjects = projects.filter((project: any) => {
    if (selectedTab === "active") return ["PENDING", "IN_PROGRESS"].includes(project.status)
    if (selectedTab === "completed") return project.status === "COMPLETED"
    return true
  })

  const updateProjectStatus = async (projectId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/seller/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchMyProjects() // Recharger les projets
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes Projets</h1>
          <p className="text-gray-600">Gérez vos projets acceptés et suivez leur progression</p>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                  onClick={() => setSelectedTab("active")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === "active"
                          ? "border-teal-500 text-teal-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Projets actifs ({projects.filter((p: any) => ["PENDING", "IN_PROGRESS"].includes(p.status)).length})
              </button>
              <button
                  onClick={() => setSelectedTab("completed")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === "completed"
                          ? "border-teal-500 text-teal-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Projets terminés ({projects.filter((p: any) => p.status === "COMPLETED").length})
              </button>
              <button
                  onClick={() => setSelectedTab("all")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === "all"
                          ? "border-teal-500 text-teal-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Tous ({projects.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span className="ml-3 text-gray-600">Chargement des projets...</span>
            </div>
        ) : filteredProjects.length > 0 ? (
            <div className="space-y-6">
              {filteredProjects.map((project: any) => {
                const statusInfo = getStatusInfo(project.status)
                return (
                    <div key={project.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
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
                        {project.client?.user?.name || "Client"}
                      </span>
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
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                              {project.client?.user?.email || "Email non disponible"}
                      </span>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="text-lg font-semibold text-teal-600 mb-2">
                            {project.acceptedProposal?.price || project.budget}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Accepté le{" "}
                    {new Date(project.acceptedProposal?.acceptedAt || project.updatedAt).toLocaleDateString("fr-FR")}
                  </span>
                        <div className="flex gap-2">
                          <button
                              onClick={() => (window.location.href = `mailto:${project.client?.user?.email}`)}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors"
                          >
                            Contacter client
                          </button>
                          {project.status === "IN_PROGRESS" && (
                              <button
                                  onClick={() => updateProjectStatus(project.id, "COMPLETED")}
                                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                              >
                                Marquer terminé
                              </button>
                          )}
                          {project.status === "PENDING" && (
                              <button
                                  onClick={() => updateProjectStatus(project.id, "IN_PROGRESS")}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                              >
                                Commencer
                              </button>
                          )}
                          <button
                              onClick={() => (window.location.href = `/seller/projects/${project.id}/details`)}
                              className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
                          >
                            Voir détails
                          </button>
                        </div>
                      </div>
                    </div>
                )
              })}
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {selectedTab === "active" ? "Aucun projet actif" : "Aucun projet terminé"}
              </p>
              <p className="text-gray-500 mb-4">
                {selectedTab === "active"
                    ? "Consultez la page 'Projets' pour déposer des offres sur les projets clients."
                    : "Vos projets terminés apparaîtront ici."}
              </p>
              {selectedTab === "active" && (
                  <button
                      onClick={() => (window.location.href = "/seller/projects")}
                      className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
                  >
                    Voir les projets disponibles
                  </button>
              )}
            </div>
        )}
      </div>
  )
}
