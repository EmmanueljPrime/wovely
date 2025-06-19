import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const take = Number(searchParams.get("take") || 20)
    const skip = Number(searchParams.get("skip") || 0)

    const category = searchParams.get("category")
    const material = searchParams.get("material")
    const color = searchParams.get("color")
    const size = searchParams.get("size")

    const products = await prisma.product.findMany({
        take,
        skip,
        where: {
            ...(category ? { categoryId: category } : {}),
            ...(material ? { materialId: material } : {}),
            ...(color ? { colorId: color } : {}),
            ...(size ? { sizeId: size } : {}),
        },
        include: {
            images: true,
        },
        orderBy: { id: "desc" },
    })

    return NextResponse.json(products)
}