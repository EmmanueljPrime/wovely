import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("🚀 Début de la création de proposition")

    const session = await getServerSession(authOptions)
    console.log("👤 Session récupérée:", {
      hasSession: !!session,
      role: session?.user?.role,
      userId: session?.user?.id
    })

    if (!session || session.user.role !== "SELLER") {
      console.log("❌ Erreur d'autorisation:", {
        hasSession: !!session,
        role: session?.user?.role
      })
      return NextResponse.json(
        { error: "Non autorisé - Accès vendeur requis" },
        { status: 401 }
      )
    }

    // Attendre les params avant d'accéder à leurs propriétés
    const resolvedParams = await params
    console.log("📊 Params récupérés:", resolvedParams)

    const projectId = parseInt(resolvedParams.id)
    console.log("🔢 ID du projet:", { original: resolvedParams.id, parsed: projectId, isValid: !isNaN(projectId) })

    if (isNaN(projectId)) {
      console.log("❌ ID de projet invalide")
      return NextResponse.json(
        { error: "ID de projet invalide" },
        { status: 400 }
      )
    }

    // Convertir l'ID utilisateur de string vers number
    const userId = parseInt(session.user.id)
    console.log("👤 ID utilisateur:", { original: session.user.id, parsed: userId, isValid: !isNaN(userId) })

    if (isNaN(userId)) {
      console.log("❌ ID utilisateur invalide")
      return NextResponse.json(
        { error: "ID utilisateur invalide" },
        { status: 400 }
      )
    }

    // Vérifier que le vendeur existe
    const seller = await prisma.seller.findUnique({
      where: { userId: userId }
    })
    console.log("🏪 Vendeur trouvé:", {
      found: !!seller,
      sellerId: seller?.id,
      businessName: seller?.business_name
    })

    if (!seller) {
      console.log("❌ Profil vendeur non trouvé")
      return NextResponse.json(
        { error: "Profil vendeur non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier que le projet existe et est disponible
    console.log("🔍 Recherche du projet avec ID:", projectId)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: true,
        proposals: {
          where: { sellerId: seller.id }
        }
      }
    })

    console.log("📋 Projet récupéré:", {
      found: !!project,
      id: project?.id,
      title: project?.title,
      status: project?.status,
      clientId: project?.clientId,
      existingProposalsCount: project?.proposals?.length || 0
    })

    if (!project) {
      console.log("❌ Projet non trouvé")
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier que le projet est en attente de propositions
    console.log("🔍 Vérification du statut du projet:", {
        currentStatus: project.status,
        isPending: project.status === "pending",
        isOpen: project.status === "open",
        isOPEN: project.status === "OPEN",
        isPENDING: project.status === "PENDING"
    })

    // Accepter différentes variations de statut (majuscules et minuscules)
    const validStatuses = ["pending", "open", "PENDING", "OPEN"]
    if (!validStatuses.includes(project.status)) {
      console.log("❌ Statut du projet invalide:", project.status)
      return NextResponse.json(
        { error: "Ce projet n'accepte plus de nouvelles propositions" },
        { status: 400 }
      )
    }

    // Vérifier que le vendeur n'a pas déjà fait une proposition
    console.log("🔍 Vérification des propositions existantes:", {
      proposalsCount: project.proposals.length,
      hasExistingProposal: project.proposals.length > 0
    })

    if (project.proposals.length > 0) {
      console.log("❌ Proposition déjà existante")
      return NextResponse.json(
        { error: "Vous avez déjà soumis une proposition pour ce projet" },
        { status: 400 }
      )
    }

    // Récupérer les données du formulaire
    const body = await request.json()
    console.log("📥 Données reçues:", {
      hasPrice: !!body.price,
      priceValue: body.price,
      hasMessage: !!body.message,
      messageLength: body.message?.length,
      hasAdvertId: !!body.advertId
    })

    const { price, message, advertId } = body

    // Validation des données
    if (!price || !message) {
      console.log("❌ Données manquantes:", { hasPrice: !!price, hasMessage: !!message })
      return NextResponse.json(
        { error: "Le prix et le message sont obligatoires" },
        { status: 400 }
      )
    }

    const proposalPrice = parseFloat(price)
    console.log("💰 Prix analysé:", {
      original: price,
      parsed: proposalPrice,
      isValid: !isNaN(proposalPrice) && proposalPrice > 0
    })

    if (isNaN(proposalPrice) || proposalPrice <= 0) {
      console.log("❌ Prix invalide")
      return NextResponse.json(
        { error: "Le prix doit être un nombre positif" },
        { status: 400 }
      )
    }

    if (message.trim().length < 10) {
      console.log("❌ Message trop court:", message.trim().length)
      return NextResponse.json(
        { error: "Le message doit contenir au moins 10 caractères" },
        { status: 400 }
      )
    }

    console.log("✅ Toutes les validations passées, création de l'annonce...")

    // Gestion de l'annonce pour la proposition
    let advert = null

    if (advertId) {
      // Si un advertId est fourni, vérifier qu'il appartient au vendeur
      advert = await prisma.advert.findFirst({
        where: {
          id: parseInt(advertId),
          sellerId: seller.id,
          status: "active"
        }
      })

      if (!advert) {
        return NextResponse.json(
          { error: "Annonce non trouvée ou inactive" },
          { status: 404 }
        )
      }
    } else {
      // Créer une annonce simple pour cette proposition
      // Ne pas lier au projet pour éviter les contraintes
      advert = await prisma.advert.create({
        data: {
          title: `Proposition pour: ${project.title}`,
          description: message,
          price: proposalPrice,
          sellerId: seller.id,
          status: "active"
          // Pas de projectId pour éviter la contrainte unique
        }
      })
    }

    // Créer la proposition
    const proposal = await prisma.proposal.create({
      data: {
        price: proposalPrice,
        message: message.trim(),
        projectId: projectId,
        sellerId: seller.id,
        advertId: advert.id,
        status: "pending"
      },
      include: {
        seller: {
          include: {
            user: true
          }
        },
        project: {
          include: {
            client: true
          }
        }
      }
    })

    // Créer une notification pour le client
    await prisma.notification.create({
      data: {
        content: `Nouvelle proposition reçue pour votre projet "${project.title}" de ${seller.business_name}`,
        userId: project.client.userId,
        readStatus: false
      }
    })

    return NextResponse.json({
      success: true,
      message: "Proposition soumise avec succès !",
      proposal: {
        id: proposal.id,
        price: proposal.price,
        message: proposal.message,
        status: proposal.status,
        created_at: proposal.created_at,
        seller: {
          id: proposal.seller.id,
          business_name: proposal.seller.business_name,
          user: {
            username: proposal.seller.user.username
          }
        }
      }
    })

  } catch (error) {
    console.error("Erreur lors de la création de la proposition:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
