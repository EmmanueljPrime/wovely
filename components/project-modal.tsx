"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, User, FileText, Clock } from "lucide-react"

type ProjectModalProps = {
    open: boolean
    onClose: () => void
    project: any | null
}

export default function ProjectModal({ open, onClose, project }: ProjectModalProps) {
    if (!project) return null

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold">{project.title}</DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">
                        Détails du projet
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Description</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                            {project.description}
                        </p>
                    </div>

                    {/* Informations principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client */}
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <User className="h-4 w-4 text-primary flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Client
                                </p>
                                <p className="text-sm font-medium">
                                    {project.client?.name || "Client anonyme"}
                                </p>
                            </div>
                        </div>

                        {/* Offres reçues */}
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Offres reçues
                                </p>
                                <p className="text-sm font-medium">
                                    {project._count?.proposals || 0} proposition{(project._count?.proposals || 0) !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Deadline */}
                        {project.deadline && (
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Échéance
                                    </p>
                                    <p className="text-sm font-medium">
                                        {new Date(project.deadline).toLocaleDateString("fr-FR", {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Localisation */}
                        {project.location && (
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Localisation
                                    </p>
                                    <p className="text-sm font-medium">
                                        {project.location}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}