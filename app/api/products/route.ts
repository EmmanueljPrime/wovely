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

    // Construire les conditions de filtrage
    const whereConditions: any = {
        ...(category ? {
            category: {
                name: {
                    in: category.split(',')
                }
            }
        } : {}),
        ...(material ? {
            material: {
                name: {
                    in: material.split(',')
                }
            }
        } : {}),
        ...(color ? {
            color: {
                name: {
                    in: color.split(',')
                }
            }
        } : {}),
        // Nouveau système pour les tailles : utiliser ProductStock
        ...(size ? {
            stockBySize: {
                some: {
                    size: {
                        name: {
                            in: size.split(',')
                        }
                    },
                    quantity: {
                        gt: 0 // Seulement les produits avec stock disponible
                    }
                }
            }
        } : {})
    }

    const products = await prisma.product.findMany({
        take,
        skip,
        where: whereConditions,
        include: {
            images: true,
            category: true,
            material: true,
            color: true,
            seller: {
                select: {
                    business_name: true,
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            },
            stockBySize: {
                include: {
                    size: true
                },
                where: {
                    quantity: {
                        gt: 0 // Inclure seulement les stocks disponibles
                    }
                }
            }
        },
        orderBy: { id: "desc" },
    })

    return NextResponse.json(products)
}