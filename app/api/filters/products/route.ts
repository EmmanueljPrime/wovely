import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Récupérer toutes les catégories, matériaux, tailles et couleurs existants
    const [categories, materials, sizes, colors] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
      prisma.material.findMany({ orderBy: { name: 'asc' } }),
      prisma.size.findMany({ orderBy: { name: 'asc' } }),
      prisma.color.findMany({ orderBy: { name: 'asc' } })
    ])

    return NextResponse.json({
      categories: categories.map(c => ({ label: c.name, value: c.name })),
      materials: materials.map(m => ({ label: m.name, value: m.name })),
      sizes: sizes.map(s => ({ label: s.name, value: s.name })),
      colors: colors.map(c => ({ label: c.name, value: c.name }))
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des filtres produits:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
