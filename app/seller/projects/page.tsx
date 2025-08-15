"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import ProjectModal from "@/components/project-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  FolderOpen,
  Search,
  RefreshCw,
  Eye,
  Send,
  User,
  MapPin,
  Calendar,
  MessageSquare,
  Euro,
  Clock,
  Filter
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SellerProjects() {
  const { user, isLoading, hasCorrectRole } = useRequireRole("SELLER")
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [proposalModalOpen, setProposalModalOpen] = useState(false)
  const [submittingProposal, setSubmittingProposal] = useState(false)
  const { toast } = useToast()

  // Form states for new proposal
  const [newProposal, setNewProposal] = useState({
    price: "",
    message: "",
    deliveryTime: "",
  })

  useEffect(() => {
    if (hasCorrectRole) {
      fetchAvailableProjects()
    }
  }, [hasCorrectRole])

  const handleViewDetails = (project: any) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  const handleOpenProposalModal = (project: any) => {
    setSelectedProject(project)
    setProposalModalOpen(true)
  }

  const fetchAvailableProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects/available")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        console.error("Erreur lors du chargement des projets")
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 FRONTEND: Début soumission proposition")
    console.log("📊 FRONTEND: Données du formulaire:", {
      selectedProject: selectedProject,
      projectId: selectedProject?.id,
      newProposal: newProposal,
      priceOriginal: newProposal.price,
      priceParsed: parseFloat(newProposal.price)
    })

    setSubmittingProposal(true)

    try {
      const requestPayload = {
        ...newProposal,
        price: parseFloat(newProposal.price),
      }

      console.log("📤 FRONTEND: Payload envoyé:", requestPayload)
      console.log("🎯 FRONTEND: URL appelée:", `/api/seller/projects/${selectedProject.id}/proposal`)

      const response = await fetch(`/api/seller/projects/${selectedProject.id}/proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })

      console.log("📥 FRONTEND: Réponse reçue:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log("✅ FRONTEND: Succès - Data:", responseData)

        toast({
          title: "Offre envoyée !",
          description: "Votre proposition a été envoyée au client avec succès.",
        })
        setProposalModalOpen(false)
        setNewProposal({ price: "", message: "", deliveryTime: "" })
        fetchAvailableProjects() // Refresh projects
      } else {
        const errorData = await response.json()
        console.log("❌ FRONTEND: Erreur - Data:", errorData)

        toast({
          title: "Erreur",
          description: errorData.error || "Une erreur est survenue lors de l'envoi de votre proposition.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("💥 FRONTEND: Exception:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      })
    } finally {
      setSubmittingProposal(false)
      console.log("🏁 FRONTEND: Fin du processus")
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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      open: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      closed: "bg-red-100 text-red-800",
    }
    return statusStyles[status as keyof typeof statusStyles] || statusStyles.open
  }

  const categories = ["all", "suits", "dresses", "alterations"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-full">
              <FolderOpen className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Projets Disponibles</h1>
              <p className="text-teal-100 text-lg">
                Découvrez les projets proposés par les clients et déposez vos offres
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 -mt-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Categories Filter */}
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-teal-600" />
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === cat
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat === "all" ? "Tous les projets" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Refresh */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher des projets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 h-10 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button
                onClick={fetchAvailableProjects}
                variant="outline"
                size="sm"
                className="h-10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des projets...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="space-y-6">
            {filteredProjects.map((project: any) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow relative"
              >
                {/* Actions - positioned absolutely */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 w-48">
                  <Button
                    onClick={() => handleViewDetails(project)}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                  <Button
                    onClick={() => handleOpenProposalModal(project)}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Déposer une offre
                  </Button>
                </div>

                <div className="pr-80"> {/* Add right padding to avoid button overlap */}
                  {/* Project Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(project.status)}`}>
                          {project.status === "open" ? "Ouvert" : project.status}
                        </span>
                      </div>
                      {project.budget && (
                        <div className="text-2xl font-bold text-teal-600">{project.budget}</div>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {project.description?.length > 30
                        ? `${project.description.substring(0, 30)}...`
                        : project.description}
                    </p>

                    {/* Project Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4 text-teal-600" />
                        <span>{project.client?.name || "Client anonyme"}</span>
                      </div>
                      {project.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span>{project.location}</span>
                        </div>
                      )}
                      {project.deadline && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          <span>{new Date(project.deadline).toLocaleDateString("fr-FR")}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="h-4 w-4 text-teal-600" />
                        <span>{project._count?.proposals || 0} offre(s)</span>
                      </div>
                    </div>

                    {/* Category & Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {project.category && (
                          <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-sm font-medium">
                            {project.category}
                          </span>
                        )}
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Publié le {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
              <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun projet disponible</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedFilter !== "all"
                  ? "Aucun projet ne correspond à vos critères de recherche."
                  : "Aucun projet n'a été publié par les clients pour le moment."}
              </p>
              {(searchTerm || selectedFilter !== "all") && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedFilter("all")
                  }}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Voir tous les projets
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={selectedProject}
      />

      {/* Submit Proposal Modal */}
      <Dialog open={proposalModalOpen} onOpenChange={setProposalModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Send className="h-6 w-6 text-teal-600" />
              Déposer une offre
            </DialogTitle>
            <p className="text-gray-600">
              Projet : <strong>{selectedProject?.title}</strong>
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmitProposal} className="space-y-6 pt-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Euro className="h-4 w-4 text-teal-600" />
                Prix proposé (€) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newProposal.price}
                onChange={(e) => setNewProposal(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Ex: 250.00"
                className="mt-2 h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="deliveryTime" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                Délai de livraison
              </Label>
              <Input
                id="deliveryTime"
                value={newProposal.deliveryTime}
                onChange={(e) => setNewProposal(prev => ({ ...prev, deliveryTime: e.target.value }))}
                placeholder="Ex: 2 semaines, 10 jours..."
                className="mt-2 h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                Message pour le client *
              </Label>
              <Textarea
                id="message"
                value={newProposal.message}
                onChange={(e) => setNewProposal(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Présentez-vous, expliquez votre approche, votre expérience dans ce domaine..."
                rows={6}
                className="mt-2 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProposalModalOpen(false)}
                className="flex-1"
                disabled={submittingProposal}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                disabled={submittingProposal}
              >
                {submittingProposal ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer l'offre
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
