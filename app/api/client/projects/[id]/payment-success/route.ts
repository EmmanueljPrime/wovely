import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const projectId = parseInt(resolvedParams.id)

    console.log("📋 Getting project payment instructions for project:", projectId)

    const userId = parseInt(session.user.id)
    const client = await prisma.client.findUnique({
      where: { userId }
    })

    if (!client) {
      return NextResponse.json(
        { error: "Profil client non trouvé" },
        { status: 404 }
      )
    }

    // Récupérer le projet avec les propositions acceptées
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: client.id
      },
      include: {
        proposals: {
          where: {
            status: { in: ["waiting_payment", "paid"] }
          },
          include: {
            seller: {
              include: {
                user: {
                  select: {
                    username: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            updated_at: 'desc'
          },
          take: 1
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      )
    }

    const acceptedProposal = project.proposals[0]

    if (!acceptedProposal) {
      return NextResponse.json(
        { error: "Aucune proposition acceptée trouvée pour ce projet" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status
      },
      proposal: {
        id: acceptedProposal.id,
        price: acceptedProposal.price,
        message: acceptedProposal.message,
        status: acceptedProposal.status
      },
      seller: {
        username: acceptedProposal.seller.user.username,
        email: acceptedProposal.seller.user.email,
        businessName: acceptedProposal.seller.business_name,
        phoneNumber: acceptedProposal.seller.phoneNumber
      },
      paymentInstructions: {
        message: "Contactez directement le vendeur pour organiser le paiement",
        methods: [
          "Virement bancaire",
          "PayPal",
          "Paiement en espèces lors de la remise",
          "Autres moyens à convenir avec le vendeur"
        ]
      }
    })

  } catch (error) {
    console.error("❌ Error getting project payment instructions:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des informations" },
      { status: 500 }
    )
  }
}
