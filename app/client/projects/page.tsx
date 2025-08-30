"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useEffect, useState } from "react"
import ProjectProposalsModal from "@/components/project-client-modal"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, FolderOpen, Calendar, Clock, Eye, Edit, Trash2 } from "lucide-react"

type Project = {
    id: string
    title: string
    description: string
    deadline?: string
    created_at: string
    images: string[]
    status?: string
    hasAcceptedProposal?: boolean
    hasPendingProposals?: boolean
}

type Proposal = {
    id: number
    price: string
    message: string
    sellerName: string
    sellerId: number
}

export default function ClientProjects() {
    const { user, isLoading, hasCorrectRole } = useRequireRole("CLIENT")
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [proposalsModalOpen, setProposalsModalOpen] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)

    // Form states for new project
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        deadline: "",
    })
    const [submitting, setSubmitting] = useState(false)

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/client/projects")
            const data = await res.json()

            // Enrichir les projets avec les informations sur les propositions
            const enrichedProjects = data.projects?.map((project: any) => ({
                ...project,
                hasAcceptedProposal: project.proposals?.some((p: any) =>
                    p.status === 'accepted' || p.status === 'paid'
                ),
                hasPendingProposals: project.proposals?.some((p: any) => p.status === 'pending')
            })) || []

            setProjects(enrichedProjects)
        } catch (error) {
            console.error("Erreur lors du chargement des projets", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [refreshKey])

    const fetchProposals = async (projectId: string) => {
        try {
            const res = await fetch(`/api/client/projects/${projectId}/proposals`)
            const data = await res.json()
            setProposals(data.proposals || [])
        } catch (error) {
            console.error("Erreur lors du chargement des propositions", error)
            setProposals([])
        }
    }

    const handleOpenProposalsModal = async (project: Project) => {
        setSelectedProject(project)
        await fetchProposals(project.id)
        setProposalsModalOpen(true)
    }

    const handleCloseProposalsModal = () => {
        setProposalsModalOpen(false)
        setSelectedProject(null)
        setProposals([])
    }

    const handleProjectUpdated = () => {
        setRefreshKey(prev => prev + 1)
    }

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const res = await fetch("/api/client/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProject),
            })

            if (res.ok) {
                setCreateModalOpen(false)
                setNewProject({ title: "", description: "", deadline: "" })
                setRefreshKey(prev => prev + 1)
            } else {
                throw new Error("Erreur lors de la création")
            }
        } catch (error) {
            console.error("Erreur lors de la création du projet", error)
        } finally {
            setSubmitting(false)
        }
    }

    const getProjectButtonText = (project: Project) => {
        if (project.hasPendingProposals) {
            return "Voir les propositions"
        } else if (project.hasAcceptedProposal) {
            return "Voir les détails"
        } else {
            return "Voir les propositions"
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        )
    }

    if (!hasCorrectRole) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 p-4 rounded-full">
                                <FolderOpen className="h-12 w-12" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Mes Projets</h1>
                                <p className="text-teal-100 text-lg">
                                    Gérez vos demandes de création et suivez les propositions
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setCreateModalOpen(true)}
                            className="bg-white text-teal-600 hover:bg-gray-50 font-semibold px-6 py-3"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Nouveau projet
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-6 relative z-10">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                        <FolderOpen className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900">{projects.length}</h3>
                        <p className="text-gray-600">Projets créés</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                        <Clock className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900">
                            {projects.filter(p => !p.deadline || new Date(p.deadline) > new Date()).length}
                        </h3>
                        <p className="text-gray-600">En cours</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                        <Calendar className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900">
                            {projects.filter(p => p.deadline && new Date(p.deadline) <= new Date()).length}
                        </h3>
                        <p className="text-gray-600">Échéance passée</p>
                    </div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Chargement de vos projets...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun projet pour le moment</h3>
                            <p className="text-gray-600 mb-6">
                                Créez votre premier projet pour recevoir des propositions de nos créateurs
                            </p>
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Créer mon premier projet
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenProposalsModal(project)}
                                            className="text-teal-600 hover:text-teal-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                    {project.description}
                                </p>

                                <div className="space-y-2 text-xs text-gray-500">
                                    {project.deadline && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-teal-600" />
                                            <span>
                                                Échéance : {new Date(project.deadline).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span>
                                            Créé le {new Date(project.created_at).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleOpenProposalsModal(project)}
                                    className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                                >
                                    {getProjectButtonText(project)}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl">
                            <Plus className="h-6 w-6 text-teal-600" />
                            Créer un nouveau projet
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateProject} className="space-y-6 pt-4">
                        <div>
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                Titre du projet *
                            </Label>
                            <Input
                                id="title"
                                value={newProject.title}
                                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Ex: Création d'une robe sur-mesure"
                                className="mt-2 h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Description détaillée *
                            </Label>
                            <Textarea
                                id="description"
                                value={newProject.description}
                                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Décrivez précisément ce que vous souhaitez : style, couleurs, matières, tailles, occasions d'usage..."
                                rows={6}
                                className="mt-2 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500 resize-none"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                                Date souhaitée de livraison (optionnel)
                            </Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={newProject.deadline}
                                onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                                className="mt-2 h-12 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCreateModalOpen(false)}
                                className="flex-1"
                                disabled={submitting}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-teal-600 hover:bg-teal-700"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Création...
                                    </div>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer le projet
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Proposals Modal */}
            {selectedProject && (
                <ProjectProposalsModal
                    open={proposalsModalOpen}
                    onClose={handleCloseProposalsModal}
                    project={selectedProject}
                    proposals={proposals}
                    onProjectUpdated={handleProjectUpdated}
                />
            )}
        </div>
    )
}
