import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.client?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const clientId = session.user.client.id

    // Récupérer le profil client complet
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        user: true
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: "Profil client non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.client?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const clientId = session.user.client.id
    const body = await request.json()

    console.log('Données reçues dans API:', body) // Debug

    const {
      firstname,
      lastname,
      phoneNumber,
      address,
      postalCode
    } = body

    // Créer l'objet de mise à jour - accepter toutes les valeurs même vides
    const updateData: any = {}

    // Mise à jour pour tous les champs présents
    if (firstname !== undefined) updateData.firstname = firstname || null
    if (lastname !== undefined) updateData.lastname = lastname || null
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber || null
    if (address !== undefined) updateData.address = address || null
    if (postalCode !== undefined) updateData.postalCode = postalCode || null

    console.log('Données à mettre à jour:', updateData) // Debug

    // Vérifier qu'au moins un champ est présent
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        error: "Aucune donnée à mettre à jour"
      }, { status: 400 })
    }

    // Mettre à jour les informations client
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: updateData,
      include: {
        user: true
      }
    })

    console.log('Client mis à jour:', updatedClient) // Debug

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      client: updatedClient
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde", details: error.message },
      { status: 500 }
    )
  }
}
