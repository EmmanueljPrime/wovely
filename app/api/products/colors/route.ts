import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const colors = await prisma.color.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(colors)
  } catch (error) {
    console.error('Erreur lors de la récupération des couleurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
