import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, username, password, role, firstname, lastname, business_name } = body

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Un utilisateur avec cet email ou nom d'utilisateur existe déjà" },
                { status: 400 },
            )
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12)

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role: role as "CLIENT" | "SELLER",
            },
        })

        // Créer le profil selon le rôle
        if (role === "CLIENT") {
            await prisma.client.create({
                data: {
                    userId: user.id,
                    firstname: firstname || "",
                    lastname: lastname || "",
                },
            })
        } else if (role === "SELLER") {
            await prisma.seller.create({
                data: {
                    userId: user.id,
                    business_name: business_name || "",
                },
            })
        }

        return NextResponse.json(
            {
                message: "Utilisateur créé avec succès",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error)
        return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 })
    }
}
