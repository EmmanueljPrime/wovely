import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const productId = Number(params.id)
    if (isNaN(productId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            images: true,
            category: true,
            color: true,
            material: true,
            stockBySize: {
                include: { size: true },
            },
        },
    })

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
}