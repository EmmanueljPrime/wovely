import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Compter le nombre de tailleurs
    const sellerCount = await prisma.seller.count()

    // Récupérer quelques exemples
    const sellers = await prisma.seller.findMany({
      take: 5,
      include: {
        user: true
      }
    })

    return NextResponse.json({
      count: sellerCount,
      examples: sellers
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
