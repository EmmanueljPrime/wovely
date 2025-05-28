import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            email,
            username,
            password,
            role,

            // Champs CLIENT
            firstname,
            lastname,
            phoneNumber,
            address,
            postalCode,
            agreeTerms,
            receiveAlerts,

            // Champs SELLER
            business_name,
            fullName,
            servicesOffered,
            yearsOfExperience,
            companyType,
            siretNumber,
            companyAddress,
            companyCity,
            companyPostalCode,
            companyCountry,
            companyPhoneNumber,
        } = body

        // Vérification : utilisateur existant
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà." },
                { status: 400 }
            )
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 12)

        // Création de l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                role,
                profile_picture: null,
                image: null,
                created_at: new Date(),
            },
        })

        // Création du profil selon le rôle
        if (role === "CLIENT") {
            await prisma.client.create({
                data: {
                    userId: user.id,
                    firstname,
                    lastname,
                    phoneNumber: phoneNumber || null,
                    address: address || null,
                    postalCode: postalCode || null,
                    agreeTerms: agreeTerms ?? false,
                    receiveAlerts: receiveAlerts ?? false,
                },
            })
        }

        if (role === "SELLER") {
            await prisma.seller.create({
                data: {
                    userId: user.id,
                    business_name,
                    fullName: fullName || null,
                    phoneNumber: phoneNumber || null,
                    servicesOffered: servicesOffered || null,
                    yearsOfExperience: yearsOfExperience || null,
                    agreeTerms: agreeTerms ?? false,
                    receiveAlerts: receiveAlerts ?? false,

                    companyType: companyType || null,
                    siretNumber: siretNumber || null,
                    companyAddress: companyAddress || null,
                    companyCity: companyCity || null,
                    companyPostalCode: companyPostalCode || null,
                    companyCountry: companyCountry || null,
                    companyPhoneNumber: companyPhoneNumber || null,
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
            { status: 201 }
        )
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error)
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        )
    }
}
