import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const tailorId = Number(params.id)

    if (isNaN(tailorId)) {
        return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    try {
        const tailor = await prisma.seller.findUnique({
            where: { id: tailorId },
            include: {
                user: true,
                products: {
                    include: { images: true },
                },
            },
        })

        if (!tailor) {
            return NextResponse.json({ error: "Tailor non trouvé" }, { status: 404 })
        }

        return NextResponse.json({ tailor })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
