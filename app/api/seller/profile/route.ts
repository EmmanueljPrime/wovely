import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.seller?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const sellerId = session.user.seller.id

    // Récupérer le profil vendeur complet
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: {
        user: true
      }
    })

    if (!seller) {
      return NextResponse.json(
        { error: "Profil vendeur non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json(seller)
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

    if (!session?.user?.seller?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const sellerId = session.user.seller.id
    const userId = session.user.id
    const body = await request.json()

    const {
      username,
      fullName,
      phoneNumber,
      business_name,
      servicesOffered,
      yearsOfExperience,
      companyAddress,
      companyCity,
      companyType,
      siretNumber,
      companyPostalCode,
      companyCountry,
      companyPhoneNumber
    } = body

    // Mettre à jour les informations utilisateur si nécessaire
    if (username && username !== session.user.username) {
      // Vérifier que le nom d'utilisateur n'est pas déjà pris
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          id: { not: userId }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "Ce nom d'utilisateur est déjà utilisé" },
          { status: 400 }
        )
      }

      await prisma.user.update({
        where: { id: userId },
        data: { username }
      })
    }

    // Mettre à jour les informations vendeur (seulement les champs qui existent)
    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        fullName,
        phoneNumber,
        business_name,
        servicesOffered,
        yearsOfExperience,
        companyAddress,
        companyCity,
        companyType,
        siretNumber,
        companyPostalCode,
        companyCountry,
        companyPhoneNumber
      },
      include: {
        user: true
      }
    })

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      seller: updatedSeller
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    )
  }
}
