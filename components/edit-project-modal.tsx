"use client"

import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {toast} from "sonner"

type EditProjectModalProps = {
    open: boolean,
    onClose: () => void,
    project: {
        id: string
        title: string
        description: string
        deadline?: string | null
    },
    onUpdated?: () => void
}

export default function EditProjectModal({open, onClose, project, onUpdated}: EditProjectModalProps) {
    const [formData, setFormData] = useState({
        title: project.title,
        description: project.description,
        deadline: project.deadline || "",
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/client/projects/${project.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Erreur lors de la mise à jour du projet")

            toast.success("Projet mis à jour avec succès")
            onClose()
            onUpdated?.()
        } catch (error) {
            toast.error("Échec de la mise à jour du projet")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Modifier le projet</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Titre</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Titre du projet"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description du projet"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Date limite</label>
                        <Input
                            type="date"
                            name="deadline"
                            value={formData.deadline || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
