"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SubmitProposalPage() {
    const { id } = useParams()
    const router = useRouter()

    const [price, setPrice] = useState("")
    const [message, setMessage] = useState("")
    const [advertId, setAdvertId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // ici, on pourrait chercher le bon advertId si tu en as un spécifique
        // tu peux aussi fixer un `advertId` temporaire en base pour test
        setAdvertId(1)
    }, [])

    const handleSubmit = async () => {
        if (!price || !message || !advertId) {
            toast.error("Tous les champs sont requis")
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/projects/${id}/proposals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    price,
                    message,
                    advertId,
                }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Erreur lors de l'envoi")
            }

            toast.success("Proposition envoyée avec succès")
            router.push("/seller/projects")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Déposer une proposition</h1>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Prix proposé (€)</label>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Ex : 150"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Détails de votre proposition"
                    />
                </div>

                {/* (optionnel) pour debug ou affichage */}
                {advertId && (
                    <p className="text-sm text-muted-foreground">Offre liée à l'annonce #{advertId}</p>
                )}
            </div>

            <div className="flex justify-end mt-6 gap-2">
                <Button variant="outline" onClick={() => router.back()} disabled={loading}>
                    Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Envoi..." : "Envoyer"}
                </Button>
            </div>
        </div>
    )
}
