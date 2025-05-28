"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import ProjectModal from "@/components/project-modal"

export default function SellerProjects() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    console.log("Rôle détecté :", user?.role)
    if (hasCorrectRole) {
      fetchAvailableProjects()
    }
  }, [hasCorrectRole])

  const handleViewDetails = (project: any) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  const fetchAvailableProjects = async () => {
    try {
      setLoading(true)
      console.log("📡 Appel API /api/projects/available")
      const response = await fetch("/api/projects/available")
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Projets récupérés :", data)
        setProjects(data)
      } else {
        const error = await response.json()
        console.error("❌ Erreur de réponse API :", error)
      }
    } catch (error) {
      console.error("🔥 Erreur lors du chargement des projets :", error)
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
    const matchesFilter =
        selectedFilter === "all" || project.category?.toLowerCase() === selectedFilter
    const matchesSearch =
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  console.log("🎯 Projets après filtrage :", filteredProjects)

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
    window.location.href = `/seller/projects/${projectId}/proposal`
  }

  return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Projets Disponibles</h1>
          <p className="text-gray-600">Découvrez les projets proposés par les clients et déposez vos offres</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            {["all", "suits", "dresses", "alterations"].map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedFilter === cat
                            ? "bg-teal-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {cat === "all" ? "Tous les projets" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
            ))}
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
                          <span className="flex items-center gap-1">👤 {project.client?.name || "Client anonyme"}</span>
                          {project.location && <span className="flex items-center gap-1">📍 {project.location}</span>}
                          {project.deadline && (
                              <span className="flex items-center gap-1">
                        🗓 Deadline: {new Date(project.deadline).toLocaleDateString("fr-FR")}
                      </span>
                          )}
                          <span className="flex items-center gap-1">📨 {project._count?.proposals || 0} offre(s)</span>
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
                            onClick={() => handleViewDetails(project)}
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
        <ProjectModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            project={selectedProject}
        />
      </div>
  )
}
