import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error("Erreur lors de la récupération des matériaux:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
