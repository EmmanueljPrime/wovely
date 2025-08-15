"use client"

import { useRequireRole } from "@/hooks/use-auth"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Mail, User, Euro, Clock, CheckCircle, XCircle, PlayCircle } from "lucide-react"

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

			// Recharger les projets pour afficher les changements
			await fetchMyProjects()
		} catch (err) {
			console.error("Erreur lors de la mise à jour :", err)
			alert("Erreur lors de la mise à jour du statut")
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

	const canUpdateStatus = (project: any) => {
		// On peut seulement modifier le statut si la proposition est acceptée
		return (
			project.proposalStatus === "accepted" &&
			["accepted", "in_progress"].includes(project.status)
		)
	}

	const getNextStatus = (currentStatus: string) => {
		if (currentStatus === "accepted") return "in_progress"
		if (currentStatus === "in_progress") return "completed"
		return null
	}

	const filtered = projects.filter((p: any) =>
		selectedTab === "all" ? true : p.status === selectedTab
	)

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				Chargement...
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
								const nextStatus = getNextStatus(project.status)

								return (
									<Card
										key={project.id}
										className="shadow-sm hover:shadow-md transition-shadow"
									>
										<CardHeader className="pb-4">
											<div className="flex justify-between items-start">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<CardTitle className="text-xl">
															{project.title}
														</CardTitle>
														<Badge
															variant="outline"
															className={`${statusInfo.color} flex items-center gap-1`}
														>
															{statusInfo.icon}
															{statusInfo.label}
														</Badge>
													</div>
													<p className="text-gray-600 text-sm line-clamp-2">
														{project.description}
													</p>
												</div>
												<div className="text-right ml-6">
													<div className="text-2xl font-bold text-green-600 flex items-center gap-1">
														<Euro className="h-5 w-5" />
														{project.myProposal?.price
															? Number(project.myProposal.price).toFixed(2)
															: "N/A"}
													</div>
													<p className="text-xs text-gray-500">
														Ma proposition
													</p>
												</div>
											</div>
										</CardHeader>

										<CardContent>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<User className="h-4 w-4" />
													<span>
														{project.client?.username || "Client inconnu"}
													</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<Mail className="h-4 w-4" />
													<span>
														{project.client?.email || "Email non disponible"}
													</span>
												</div>
												{project.deadline && (
													<div className="flex items-center gap-2 text-sm text-gray-600">
														<CalendarDays className="h-4 w-4" />
														<span>
															Échéance :{" "}
															{new Date(project.deadline).toLocaleDateString("fr-FR")}
														</span>
													</div>
												)}
											</div>

											<div className="flex justify-between items-center pt-4 border-t border-gray-200">
												<div className="text-sm text-gray-500">
													<p>
														Proposition envoyée le{" "}
														{new Date(project.myProposal.created_at).toLocaleDateString(
															"fr-FR"
														)}
													</p>
													{project.status === "accepted" && (
														<p className="text-green-600">
															✓ Proposition acceptée
														</p>
													)}
												</div>

												<div className="flex items-center gap-3">
													{canUpdateStatus(project) && nextStatus && (
														<Select
															value={project.projectStatus}
															onValueChange={(value) =>
																updateProjectStatus(project.id, value)
															}
															disabled={updatingStatus === project.id}
														>
															<SelectTrigger className="w-40">
																<SelectValue placeholder="Changer le statut" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="accepted">Accepté</SelectItem>
																<SelectItem value="in_progress">En cours</SelectItem>
																<SelectItem value="completed">Terminé</SelectItem>
															</SelectContent>
														</Select>
													)}

													<Button
														variant="outline"
														onClick={() =>
															(window.location.href = `/seller/projects/${project.id}/details`)
														}
														className="hover:bg-blue-50"
													>
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
								>
									Voir les projets disponibles
								</Button>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
