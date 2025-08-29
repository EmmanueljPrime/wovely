"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import {
  CalendarDays,
  User,
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Eye,
  MessageCircle,
  Loader2,
  Info,
  AlertTriangle
} from "lucide-react"

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
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState(false)

  useEffect(() => {
    if (hasCorrectRole) fetchMyProjects()
  }, [hasCorrectRole])

  const fetchMyProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/seller/my-projects")
      if (!res.ok) throw new Error("Erreur lors du chargement")
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error("Erreur de chargement :", err)
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProjectStatus = async (projectId: number, newStatus: string) => {
    try {
      setUpdatingStatus(projectId)
      const res = await fetch(`/api/projects/${projectId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Erreur lors de la mise à jour")

      toast({
        title: "Succès",
        description: "Statut du projet mis à jour avec succès"
      })

      await fetchMyProjects()
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err)
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive"
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusInfo = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: JSX.Element }> = {
      pending: {
        label: "En attente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="h-3 w-3" />,
      },
      accepted: {
        label: "Accepté",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      in_progress: {
        label: "En cours",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <PlayCircle className="h-3 w-3" />,
      },
      completed: {
        label: "Terminé",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      cancelled: {
        label: "Annulé",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-3 w-3" />,
      },
    }
    return map[status] || {
      label: "Inconnu",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <Clock className="h-3 w-3" />,
    }
  }

  const getProposalStatusInfo = (proposalStatus: string) => {
    const map: Record<string, { label: string; color: string; paymentInstruction?: string }> = {
      pending: {
        label: "En attente de réponse",
        color: "bg-yellow-100 text-yellow-800",
      },
      accepted: {
        label: "Acceptée",
        color: "bg-green-100 text-green-800",
        paymentInstruction: "Le client va organiser le paiement directement avec vous"
      },
      paid: {
        label: "Payée",
        color: "bg-emerald-100 text-emerald-800"
      },
      rejected: {
        label: "Refusée",
        color: "bg-red-100 text-red-800"
      }
    }
    return map[proposalStatus] || map.pending
  }

  const canUpdateStatus = (project: any) => {
    return project.proposalStatus === "accepted" &&
           ["accepted", "in_progress", "completed"].includes(project.status)
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }

  const filtered = projects.filter((p: any) =>
    selectedTab === "all" ? true : p.status === selectedTab
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Projets
        </h1>
        <p className="text-gray-600">
          Gérez vos propositions et suivez l'avancement de vos projets
        </p>
      </div>

      {/* Information importante sur le paiement manuel */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Information importante :</strong> Pour les projets sur-mesure, les paiements se font directement entre vous et le client.
          Une fois votre proposition acceptée, organisez ensemble le paiement par virement, PayPal ou tout autre moyen qui vous convient.
        </AlertDescription>
      </Alert>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => {
            const count =
              tab.value === "all"
                ? projects.length
                : projects.filter((p: any) => p.status === tab.value)
                    .length

            return (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
                {tab.label} ({count})
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {loading ? (
            <div className="text-center text-gray-600 py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4">Chargement des projets...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-6">
              {filtered.map((project: any) => {
                const statusInfo = getStatusInfo(project.status)
                const proposalStatusInfo = getProposalStatusInfo(project.proposalStatus)

                return (
                  <Card
                    key={project.id}
                    className="shadow-sm hover:shadow-lg transition-all duration-200 border-l-4 border-l-teal-500"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <CardTitle className="text-xl font-bold">
                              {project.title}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`${statusInfo.color} flex items-center gap-1`}
                            >
                              {statusInfo.icon}
                              {statusInfo.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`${proposalStatusInfo.color} flex items-center gap-1`}
                            >
                              {proposalStatusInfo.label}
                            </Badge>
                          </div>

                          {/* Description tronquée avec style amélioré */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                              {truncateText(project.description, 50)}
                            </p>
                            {project.description && project.description.length > 50 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-teal-600 hover:text-teal-700 p-0 h-auto mt-2"
                                onClick={() => {
                                  setSelectedProject(project)
                                  setDetailsOpen(true)
                                }}
                              >
                                Lire la suite...
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Prix avec design amélioré */}
                        <div className="text-right ml-6">
                          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg px-4 py-3 border border-teal-200">
                            <div className="text-2xl font-bold text-teal-600 flex items-center gap-1">
                              {project.myProposal?.price
                                ? formatPrice(Number(project.myProposal.price))
                                : "N/A"}
                            </div>
                            <p className="text-xs text-teal-600 font-medium">
                              Ma proposition
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-md px-2 py-1">
                          <User className="h-4 w-4 text-teal-600" />
                          <span className="font-medium">
                            {project.client?.username || "Client inconnu"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-md px-2 py-1">
                          <MessageCircle className="h-4 w-4 text-blue-600" />
                          <span>
                            {project.client?.email || "Email non disponible"}
                          </span>
                        </div>
                        {project.deadline && (
                          <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-md px-2 py-1">
                            <CalendarDays className="h-4 w-4" />
                            <span className="font-medium">
                              Échéance : {new Date(project.deadline).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          <p>
                            Proposition envoyée le{" "}
                            {new Date(project.myProposal?.created_at || project.created_at).toLocaleDateString("fr-FR")}
                          </p>
                          {project.proposalStatus === "accepted" && (
                            <p className="text-green-600 font-medium">
                              ✓ Proposition acceptée - Organisez le paiement
                            </p>
                          )}
                          {project.proposalStatus === "paid" && (
                            <p className="text-emerald-600 font-medium">
                              ✓ Projet payé - Vous pouvez commencer
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Dropdown classique pour gérer le statut du projet */}
                          {canUpdateStatus(project) && (
                            <Select
                              value={project.status}
                              onValueChange={(value) =>
                                updateProjectStatus(project.id, value)
                              }
                              disabled={updatingStatus === project.id}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Statut projet" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="accepted">Accepté</SelectItem>
                                <SelectItem value="in_progress">En cours</SelectItem>
                                <SelectItem value="completed">Terminé</SelectItem>
                                <SelectItem value="cancelled">Annulé</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          {updatingStatus === project.id && (
                            <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                          )}

                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedProject(project)
                              setDetailsOpen(true)
                            }}
                            className="hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Clock className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun projet
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedTab === "all"
                    ? "Vous n'avez encore fait aucune proposition."
                    : `Aucun projet dans la catégorie "${tabs.find(
                        (t) => t.value === selectedTab
                      )?.label}".`}
                </p>
                <Button
                  onClick={() => (window.location.href = "/seller/projects")}
                  variant="outline"
                  className="bg-teal-600 text-white hover:bg-teal-700"
                >
                  Voir les projets disponibles
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de détails - avec informations de paiement */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageCircle className="h-6 w-6 text-teal-600" />
              Détails du projet
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6 pt-4">
              {/* Instructions de paiement dans le modal */}
              {(selectedProject.proposalStatus === 'accepted' || selectedProject.proposalStatus === 'waiting_payment') && (
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Action requise :</strong> Le client a accepté votre proposition.
                    Contactez-le directement pour organiser le paiement de {selectedProject.myProposal?.price ? formatPrice(Number(selectedProject.myProposal.price)) : 'N/A'}.
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Client :</strong> {selectedProject.client?.username || 'Inconnu'}</p>
                      <p><strong>Email :</strong> {selectedProject.client?.email || 'Non disponible'}</p>
                      <p><strong>Méthodes suggérées :</strong> Virement bancaire, PayPal, espèces...</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Reste du contenu du modal */}
              <div className="border-b pb-6">
                <h2 className="text-3xl font-bold mb-3 text-gray-900">{selectedProject.title}</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className={`${getStatusInfo(selectedProject.status).color} text-sm px-3 py-1`}>
                    {getStatusInfo(selectedProject.status).icon}
                    <span className="ml-1">{getStatusInfo(selectedProject.status).label}</span>
                  </Badge>
                  <Badge className={`${getProposalStatusInfo(selectedProject.proposalStatus).color} text-sm px-3 py-1`}>
                    {getProposalStatusInfo(selectedProject.proposalStatus).label}
                  </Badge>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    Créé le {new Date(selectedProject.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              {/* Description complète */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Description du projet</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Ma proposition */}
              {selectedProject.myProposal && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Ma proposition</h3>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-teal-600 font-medium">Prix proposé</p>
                        <p className="text-2xl font-bold text-teal-700">
                          {formatPrice(Number(selectedProject.myProposal.price))}
                        </p>
                      </div>
                      <Badge className={`${getProposalStatusInfo(selectedProject.proposalStatus).color}`}>
                        {getProposalStatusInfo(selectedProject.proposalStatus).label}
                      </Badge>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedProject.myProposal.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
