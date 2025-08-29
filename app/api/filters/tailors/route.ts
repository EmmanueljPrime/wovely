import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Compter combien il y a de sellers professionnels vs particuliers
    const totalSellers = await prisma.seller.count()
    const professionalSellers = await prisma.seller.count({
      where: {
        companyType: { not: null }
      }
    })
    const individualSellers = totalSellers - professionalSellers

    console.log(`Total sellers: ${totalSellers}, Professional: ${professionalSellers}, Individual: ${individualSellers}`)

    // Retourner seulement le filtre type pro/amateur qui existe vraiment
    return NextResponse.json({
      types: [
        { 
          label: `Particulier (${individualSellers})`, 
          value: 'individual' 
        },
        { 
          label: `Professionnel (${professionalSellers})`, 
          value: 'professional' 
        }
      ]
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des filtres tailleurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
