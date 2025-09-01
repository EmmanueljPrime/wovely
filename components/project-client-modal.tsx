"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Euro, MessageSquare, CheckCircle, Clock, AlertTriangle, Loader2, Mail, Phone, Building2, CreditCard, Info, X } from "lucide-react"

// Types
type Proposal = {
    id: number
    price: string
    message: string
    sellerName: string
    sellerId: number
    sellerEmail?: string | null
    status: string
    created_at: string
}

type Project = {
    id: string
    title: string
    description: string
    deadline?: string
    created_at: string
    images: string[]
    status?: string
    order?: {
        id: number
        totalPrice: number
        status: string
        type: string
    }
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
    const [acceptingProposal, setAcceptingProposal] = useState<number | null>(null)
    const [rejectingProposal, setRejectingProposal] = useState<number | null>(null)
    const [acceptedProposal, setAcceptedProposal] = useState<any>(null)

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(numPrice)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const getStatusInfo = (status: string) => {
        const statusMap = {
            pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
            accepted: { label: "Acceptée", color: "bg-green-100 text-green-800", icon: CheckCircle },
            paid: { label: "Payée", color: "bg-green-100 text-green-800", icon: CheckCircle },
            rejected: { label: "Refusée", color: "bg-red-100 text-red-800", icon: X }
        }
        return statusMap[status as keyof typeof statusMap] || statusMap.pending
    }

    const handleAcceptProposal = async (proposalId: number) => {
        try {
            setAcceptingProposal(proposalId)

            // Accepter la proposition
            const acceptResponse = await fetch(`/api/proposals/${proposalId}/accept`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!acceptResponse.ok) {
                throw new Error('Erreur lors de l\'acceptation de la proposition')
            }

            // Rafraîchir les données
            if (onProjectUpdated) {
                onProjectUpdated()
            }

            // Fermer le modal après acceptation
            onClose()

        } catch (error) {
            console.error('Erreur:', error)
        } finally {
            setAcceptingProposal(null)
        }
    }

    const handleRejectProposal = async (proposalId: number) => {
        try {
            setRejectingProposal(proposalId)

            const rejectResponse = await fetch(`/api/proposals/${proposalId}/reject`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!rejectResponse.ok) {
                throw new Error('Erreur lors du refus de la proposition')
            }

            // Rafraîchir les données
            if (onProjectUpdated) {
                onProjectUpdated()
            }

        } catch (error) {
            console.error('Erreur:', error)
        } finally {
            setRejectingProposal(null)
        }
    }

    // Vérifier s'il y a des propositions en attente
    const hasPendingProposals = proposals.some(p => p.status === 'pending')
    const hasAcceptedProposal = proposals.some(p => p.status === 'accepted' || p.status === 'paid')

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <MessageSquare className="h-6 w-6 text-teal-600" />
                        {hasPendingProposals ? `Propositions pour "${project.title}"` : `Détails du projet "${project.title}"`}
                    </DialogTitle>
                    <DialogDescription>
                        {hasPendingProposals
                            ? `${proposals.length} proposition${proposals.length !== 1 ? 's' : ''} reçue${proposals.length !== 1 ? 's' : ''}`
                            : "Suivi de votre projet"
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Informations importantes sur le paiement manuel */}
                {hasAcceptedProposal && (
                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-blue-800">
                            <strong>Information importante :</strong> Pour les projets sur-mesure, le paiement se fait directement avec le vendeur.
                            Vous pourrez organiser le paiement par virement, PayPal ou tout autre moyen convenu ensemble.
                            <br /><br />
                            <strong>⚠️ Avertissement :</strong> Wovely se désengage de tout problème lié au paiement des projets car les transactions se font en dehors de notre plateforme.
                            Soyez vigilant face aux tentatives d'escroquerie et vérifiez toujours l'identité du vendeur avant d'effectuer un paiement.
                        </AlertDescription>
                    </Alert>
                )}

                <ScrollArea className="max-h-[60vh] pr-4">
                    {proposals.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucune proposition pour le moment
                            </h3>
                            <p className="text-gray-600">
                                Les créateurs vont bientôt vous envoyer leurs propositions.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {proposals.map((proposal) => {
                                const statusInfo = getStatusInfo(proposal.status)
                                const StatusIcon = statusInfo.icon
                                const isProcessing = acceptingProposal === proposal.id || rejectingProposal === proposal.id
                                const isPending = proposal.status === 'pending'

                                return (
                                    <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-teal-100 p-2 rounded-full">
                                                        <User className="h-4 w-4 text-teal-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            {proposal.sellerName}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            Proposé le {formatDate(proposal.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={statusInfo.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {statusInfo.label}
                                                    </Badge>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-teal-600">
                                                            {formatPrice(proposal.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                <p className="text-gray-700 whitespace-pre-wrap">
                                                    {proposal.message}
                                                </p>
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                {isPending && (
                                                    <>
                                                        <Button
                                                            onClick={() => handleRejectProposal(proposal.id)}
                                                            disabled={isProcessing}
                                                            variant="outline"
                                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                                        >
                                                            {rejectingProposal === proposal.id ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    Refus...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <X className="h-4 w-4 mr-2" />
                                                                    Refuser
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleAcceptProposal(proposal.id)}
                                                            disabled={isProcessing}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            {acceptingProposal === proposal.id ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    Acceptation...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Accepter
                                                                </>
                                                            )}
                                                        </Button>
                                                    </>
                                                )}

                                                {(proposal.status === 'accepted') && (
                                                    <div className="space-y-3 w-full">
                                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                <span className="font-medium text-green-900">Proposition acceptée</span>
                                                            </div>
                                                            <p className="text-green-800 text-sm mb-3">
                                                                Organisez le paiement directement avec le vendeur ({formatPrice(proposal.price)}).
                                                            </p>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex items-center gap-2 text-gray-700">
                                                                    <Mail className="h-3 w-3" />
                                                                    <span>
                                                                        Contactez le vendeur par message privé
                                                                        {proposal.sellerEmail && (
                                                                            <span className="font-medium text-teal-600 ml-1">
                                                                                ({proposal.sellerEmail})
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-700">
                                                                    <CreditCard className="h-3 w-3" />
                                                                    <span>Méthodes : Virement, PayPal, espèces...</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {proposal.status === 'paid' && (
                                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span className="font-medium">Payé - Projet en cours</span>
                                                    </div>
                                                )}

                                                {proposal.status === 'rejected' && (
                                                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
                                                        <X className="h-4 w-4" />
                                                        <span className="font-medium">Proposition refusée</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
