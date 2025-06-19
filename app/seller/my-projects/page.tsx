"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"

const tabs = [
  { label: "Tous", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "Acceptés", value: "accepted" },
  { label: "En cours", value: "in_progress" },
  { label: "Terminés", value: "completed" },
  { label: "Annulés", value: "cancelled" },
]

export default function SellerMyProjects() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    if (hasCorrectRole) fetchMyProjects()
  }, [hasCorrectRole])

  const fetchMyProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/seller/my-projects")
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error("Erreur de chargement :", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      accepted: { label: "Accepté", color: "bg-teal-100 text-teal-800" },
      in_progress: { label: "En cours", color: "bg-blue-100 text-blue-800" },
      completed: { label: "Terminé", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" },
    }
    return map[status] || { label: "Inconnu", color: "bg-gray-100 text-gray-800" }
  }

  const filtered = projects.filter((p: any) =>
      selectedTab === "all" ? true : p.status === selectedTab
  )

  return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes Projets</h1>
          <p className="text-gray-600">Gérez vos projets acceptés et suivez leur progression</p>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap gap-4">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => setSelectedTab(tab.value)}
                    className={`py-2 px-3 border-b-2 font-medium text-sm ${
                        selectedTab === tab.value
                            ? "border-teal-500 text-teal-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.label} ({tab.value === "all" ? projects.length : projects.filter((p: any) => p.status === tab.value).length})
                </button>
            ))}
          </nav>
        </div>

        {loading ? (
            <div className="text-center text-gray-600">Chargement...</div>
        ) : filtered.length > 0 ? (
            <div className="space-y-6">
              {filtered.map((project: any) => {
                const statusInfo = getStatusInfo(project.status)
                return (
                    <div key={project.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
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
                            <span>Client : {project.client?.username || "Inconnu"}</span>
                            {project.deadline && (
                                <span>
                          Deadline : {new Date(project.deadline).toLocaleDateString("fr-FR")}
                        </span>
                            )}
                            <span>Email : {project.client?.email || "Non disponible"}</span>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="text-lg font-semibold text-teal-600 mb-2">
                            {project.acceptedProposal?.price ?? project.budget ?? "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Accepté le{" "}
                    {project.acceptedProposal?.acceptedAt
                        ? new Date(project.acceptedProposal.acceptedAt).toLocaleDateString("fr-FR")
                        : new Date(project.updatedAt).toLocaleDateString("fr-FR")}
                  </span>
                        <button
                            onClick={() => (window.location.href = `/seller/projects/${project.id}/details`)}
                            className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors"
                        >
                          Voir détails
                        </button>
                      </div>
                    </div>
                )
              })}
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">Aucun projet</p>
              <p className="text-gray-500 mb-4">Aucun projet pour cet onglet.</p>
            </div>
        )}
      </div>
  )
}
