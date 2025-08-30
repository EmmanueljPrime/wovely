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
      businessName,
      fullName,
      phoneNumber,
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

    // Créer l'objet de mise à jour en filtrant les valeurs undefined
    const updateData: any = {}

    if (businessName !== undefined) updateData.business_name = businessName
    if (fullName !== undefined) updateData.fullName = fullName
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber
    if (servicesOffered !== undefined) updateData.servicesOffered = servicesOffered
    if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience
    if (companyAddress !== undefined) updateData.companyAddress = companyAddress
    if (companyCity !== undefined) updateData.companyCity = companyCity
    if (companyType !== undefined) updateData.companyType = companyType
    if (siretNumber !== undefined) updateData.siretNumber = siretNumber
    if (companyPostalCode !== undefined) updateData.companyPostalCode = companyPostalCode
    if (companyCountry !== undefined) updateData.companyCountry = companyCountry
    if (companyPhoneNumber !== undefined) updateData.companyPhoneNumber = companyPhoneNumber

    // Mettre à jour les informations vendeur
    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: updateData,
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
