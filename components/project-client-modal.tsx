"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { User, Euro, MessageSquare, Package, Edit, Trash2 } from "lucide-react"

import EditProjectModal from "./edit-project-modal"

// Types
type Proposal = {
    id: number
    price: string
    message: string
    sellerName: string
    sellerId: number
}

type Project = {
    id: string
    title: string
    description: string
    deadline?: string
    created_at: string
    images: string[]
}

type ProjectModalProps = {
    project: Project
    proposals: Proposal[]
    open: boolean
    onClose: () => void
    onProjectUpdated?: () => void
}

export default function ProjectProposalsModal({
                                                  project,
                                                  proposals,
                                                  open,
                                                  onClose,
                                                  onProjectUpdated,
                                              }: ProjectModalProps) {
    const proposalCount = Array.isArray(proposals) ? proposals.length : 0
    const [editOpen, setEditOpen] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return
        try {
            const res = await fetch(`/api/client/projects/${project.id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Échec de la suppression")
            onClose()
            onProjectUpdated?.()
        } catch (err) {
            alert("Erreur lors de la suppression")
            console.error(err)
        }
    }

    const handleAccept = async (proposalId: number) => {
        try {
            const res = await fetch(`/api/projects/${project.id}/proposals/${proposalId}/accept`, {
                method: "POST",
            })
            if (!res.ok) throw new Error("Erreur acceptation")
            onClose()
            onProjectUpdated?.()
        } catch (err) {
            alert("Erreur lors de l’acceptation")
        }
    }

    const handleReject = async (proposalId: number) => {
        try {
            const res = await fetch(`/api/projects/${project.id}/proposals/${proposalId}/reject`, {
                method: "POST",
            })
            if (!res.ok) throw new Error("Erreur refus")
            onClose()
            onProjectUpdated?.()
        } catch (err) {
            alert("Erreur lors du refus")
        }
    }


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        {project.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <DialogDescription className="text-base">
                            Propositions déposées par les tailleurs
                        </DialogDescription>
                        <Badge variant="secondary" className="ml-auto">
                            {proposalCount} proposition{proposalCount !== 1 ? "s" : ""}
                        </Badge>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-96 pr-4">
                    <div className="space-y-4">
                        {!Array.isArray(proposals) ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">Chargement des propositions...</p>
                                </div>
                            </div>
                        ) : proposals.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground font-medium">Aucune proposition reçue</p>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Les tailleurs n'ont pas encore soumis de propositions pour ce projet.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            proposals.map((proposal) => (
                                <div
                                    key={proposal.id}
                                    className="border border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary"/>
                                            <span className="font-medium text-foreground">{proposal.sellerName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Euro className="h-4 w-4 text-green-600"/>
                                            <span
                                                className="font-semibold text-lg text-green-600">{proposal.price} €</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-3 w-3 text-muted-foreground"/>
                                            <span
                                                className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Message
                      </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                                            {proposal.message}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleAccept(proposal.id)}
                                            className="px-4 py-2 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200 "
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleReject(proposal.id)}
                                            className="px-4 py-2 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200 "
                                        >
                                            Refuser
                                        </button>
                                        <button
                                            onClick={() => window.open(`/tailor/${proposal.sellerId}`, "_blank")}
                                            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 "
                                        >
                                            Voir le profil
                                        </button>
                                    </div>


                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    <div className="flex gap-3 w-full">
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-none h-11 px-6 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                            onClick={() => setEditOpen(true)}
                        >
                        <Edit className="h-4 w-4 mr-2 text-primary" />
                            <span className="font-medium">Modifier le projet</span>
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-teal-500 hover:bg-teal-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="font-medium">Supprimer le projet</span>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>

            {editOpen && (
                <EditProjectModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    project={project}
                    onUpdated={() => {
                        setEditOpen(false)
                        onClose()
                        onProjectUpdated?.()
                    }}
                />
            )}
        </Dialog>
    )
}
