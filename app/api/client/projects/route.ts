import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "CLIENT") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const projects = await prisma.project.findMany({
            where: {
                clientId: session.user.client?.id,
            },
            include: {
                _count: {
                    select: {
                        proposals: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération des projets" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "CLIENT") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, category, budget, deadline, location } = body

        const project = await prisma.project.create({
            data: {
                title,
                description,
                category,
                budget,
                deadline: deadline ? new Date(deadline) : null,
                location,
                clientId: session.user.client?.id!,
                status: "OPEN",
            },
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error("Erreur lors de la création du projet:", error)
        return NextResponse.json({ error: "Erreur lors de la création du projet" }, { status: 500 })
    }
}
