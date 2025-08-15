"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"
import {
  Calendar,
  MapPin,
  User,
  FileText,
  Clock,
  Euro,
  Star,
  MessageCircle,
  Send,
  Image as ImageIcon,
  Tag,
  Briefcase
} from "lucide-react"

type ProjectModalProps = {
    open: boolean
    onClose: () => void
    project: any | null
}

export default function ProjectModal({ open, onClose, project }: ProjectModalProps) {
    const [showProposalForm, setShowProposalForm] = useState(false)
    const [proposalData, setProposalData] = useState({
        price: "",
        message: ""
    })
    const [submitting, setSubmitting] = useState(false)

    if (!project) return null

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'pending': { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
            'accepted': { label: 'Accepté', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
            'in_progress': { label: 'En cours', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
            'completed': { label: 'Terminé', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
        }
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    }

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!proposalData.price || !proposalData.message) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs",
                variant: "destructive"
            })
            return
        }

        if (parseFloat(proposalData.price) <= 0) {
            toast({
                title: "Erreur",
                description: "Le prix doit être supérieur à 0",
                variant: "destructive"
            })
            return
        }

        if (proposalData.message.trim().length < 10) {
            toast({
                title: "Erreur",
                description: "Le message doit contenir au moins 10 caractères",
                variant: "destructive"
            })
            return
        }

        setSubmitting(true)

        try {
            const response = await fetch(`/api/seller/projects/${project.id}/proposal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price: proposalData.price,
                    message: proposalData.message.trim()
                })
            })

            if (response.ok) {
                toast({
                    title: "Succès",
                    description: "Votre proposition a été soumise avec succès !",
                })
                setShowProposalForm(false)
                setProposalData({ price: "", message: "" })
                onClose()
            } else {
                const error = await response.json()
                throw new Error(error.error || 'Erreur lors de la soumission')
            }
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setSubmitting(false)
        }
    }

    const statusInfo = getStatusBadge(project.status)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                {/* Header compact */}
                <DialogHeader className="pb-4 border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg shadow-md">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900 leading-tight">
                                    {showProposalForm ? "Soumettre une proposition" : project.title}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-gray-600">
                                    {showProposalForm
                                        ? `Proposer vos services pour le projet "${project.title}"`
                                        : `Publié le ${new Date(project.created_at).toLocaleDateString("fr-FR")}`
                                    }
                                </DialogDescription>
                            </div>
                        </div>
                        {!showProposalForm && (
                            <Badge className={`${statusInfo.color} font-medium px-2 py-1 text-xs`}>
                                {statusInfo.label}
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                {/* Contenu principal - adaptatif */}
                <div className="flex-1 min-h-0">
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        {!showProposalForm ? (
                            <div className="space-y-6 py-4">
                                {/* Section Client compacte */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarImage src={project.client?.profilePicture} />
                                            <AvatarFallback className="bg-teal-500 text-white font-semibold text-sm">
                                                {project.client?.firstname?.[0]}{project.client?.lastname?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {project.client?.firstname} {project.client?.lastname}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    Client
                                                </span>
                                                {project.client?.address && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {project.client.address}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description compacte */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-100 p-1.5 rounded-lg">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Description du projet</h3>
                                    </div>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-32 overflow-y-auto">
                                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words">
                                            {project.description}
                                        </div>
                                    </div>
                                </div>

                                {/* Informations en grid compact */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Échéance */}
                                    {project.deadline && (
                                        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                                            <div className="bg-red-100 p-1.5 rounded-lg w-fit mx-auto mb-2">
                                                <Calendar className="h-4 w-4 text-red-600" />
                                            </div>
                                            <h4 className="text-xs font-medium text-gray-600 mb-1">Échéance</h4>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {new Date(project.deadline).toLocaleDateString("fr-FR", {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                                            </p>
                                        </div>
                                    )}

                                    {/* Propositions */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                                        <div className="bg-green-100 p-1.5 rounded-lg w-fit mx-auto mb-2">
                                            <MessageCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <h4 className="text-xs font-medium text-gray-600 mb-1">Propositions</h4>
                                        <p className="text-lg font-bold text-green-600">
                                            {project._count?.proposals || 0}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(project._count?.proposals || 0) <= 1 ? 'proposition' : 'propositions'}
                                        </p>
                                    </div>

                                    {/* Budget */}
                                    {project.estimatedBudget ? (
                                        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                                            <div className="bg-purple-100 p-1.5 rounded-lg w-fit mx-auto mb-2">
                                                <Euro className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <h4 className="text-xs font-medium text-gray-600 mb-1">Budget</h4>
                                            <p className="text-lg font-bold text-purple-600">
                                                {project.estimatedBudget}€
                                            </p>
                                            <p className="text-xs text-gray-500">estimé</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                                            <div className="bg-gray-100 p-1.5 rounded-lg w-fit mx-auto mb-2">
                                                <Euro className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <h4 className="text-xs font-medium text-gray-600 mb-1">Budget</h4>
                                            <p className="text-sm text-gray-500">
                                                Non spécifié
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Images compactes */}
                                {project.images && project.images.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-orange-100 p-1.5 rounded-lg">
                                                <ImageIcon className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">Images de référence</h3>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {project.images.slice(0, 4).map((image: string, index: number) => (
                                                <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-sm">
                                                    <img
                                                        src={image}
                                                        alt={`Image ${index + 1}`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        {project.images.length > 4 && (
                                            <p className="text-xs text-gray-500 text-center">
                                                +{project.images.length - 4} autres images
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Catégorie compacte */}
                                {project.category && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-indigo-100 p-1.5 rounded-lg">
                                                <Tag className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900">Catégorie</h3>
                                        </div>
                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                                            {project.category}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Formulaire de proposition
                            <div className="space-y-6 py-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Soumettre une proposition
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Proposez vos services pour le projet "{project.title}"
                                    </p>
                                </div>

                                <form onSubmit={handleSubmitProposal} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="proposal-price">Prix proposé (€) *</Label>
                                            <Input
                                                id="proposal-price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="Ex: 150.00"
                                                value={proposalData.price}
                                                onChange={(e) => setProposalData(prev => ({ ...prev, price: e.target.value }))}
                                                required
                                                className="text-lg font-medium"
                                            />
                                            <p className="text-xs text-gray-500">
                                                Indiquez votre tarif pour ce projet
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">Projet</Label>
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                <p className="font-medium text-gray-900">{project.title}</p>
                                                <p className="text-sm text-gray-600">
                                                    Client: {project.client?.firstname} {project.client?.lastname}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="proposal-message">Message de proposition *</Label>
                                        <Textarea
                                            id="proposal-message"
                                            placeholder="Décrivez votre approche, votre expérience avec ce type de projet, les délais envisagés..."
                                            value={proposalData.message}
                                            onChange={(e) => setProposalData(prev => ({ ...prev, message: e.target.value }))}
                                            required
                                            rows={6}
                                            className="resize-none"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Minimum 10 caractères - {proposalData.message.length}/500
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 p-1 rounded-full flex-shrink-0 mt-0.5">
                                                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-900 mb-1">
                                                    Conseils pour une bonne proposition
                                                </h4>
                                                <ul className="text-xs text-blue-800 space-y-1">
                                                    <li>• Soyez précis sur votre approche et vos compétences</li>
                                                    <li>• Mentionnez des projets similaires réalisés</li>
                                                    <li>• Indiquez un délai de réalisation réaliste</li>
                                                    <li>• Justifiez votre tarif par rapport à la complexité</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowProposalForm(false)}
                                            className="flex-1"
                                            disabled={submitting}
                                        >
                                            Retour
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold flex-1"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Envoi...
                                                </div>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Envoyer la proposition
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions fixes en bas */}
                {!showProposalForm && (
                    <div className="border-t pt-4 flex-shrink-0">
                        <div className="flex gap-3">
                            {project.status === 'pending' ? (
                                <Button
                                    onClick={() => setShowProposalForm(true)}
                                    className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex-1"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Soumettre une proposition
                                </Button>
                            ) : (
                                <Button
                                    disabled
                                    className="bg-gray-400 text-white px-6 py-2 rounded-lg flex-1 cursor-not-allowed"
                                >
                                    Projet non disponible
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg"
                                onClick={onClose}
                            >
                                Fermer
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}