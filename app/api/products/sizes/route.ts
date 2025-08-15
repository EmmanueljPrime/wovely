import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(sizes)
  } catch (error) {
    console.error("Erreur lors de la récupération des tailles:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
