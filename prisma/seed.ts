// prisma/seed.ts
import { PrismaClient, Role, Prisma } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    // --- RESET propre (ordre = d’abord les dépendants) ---
    await prisma.notification.deleteMany()
    await prisma.message.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.proposal.deleteMany()
    await prisma.advert.deleteMany()
    await prisma.project.deleteMany()
    await prisma.image.deleteMany()
    await prisma.productStock.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.material.deleteMany()
    await prisma.color.deleteMany()
    await prisma.size.deleteMany()
    await prisma.seller.deleteMany()
    await prisma.client.deleteMany()
    // NextAuth (au cas où tu aies joué avec l’auth entre deux seeds)
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.verificationToken.deleteMany()
    await prisma.user.deleteMany()

    console.log("🧹 Données existantes supprimées")

    // --- RÉFÉRENTIELS ---
    const categoryData = [
        { id: "cat-robes",       name: "Robes" },
        { id: "cat-costumes",    name: "Costumes" },
        { id: "cat-tshirts",     name: "T-shirts" },
        { id: "cat-pantalons",   name: "Pantalons" },
        { id: "cat-pulls",       name: "Pulls" },
        { id: "cat-accessoires", name: "Accessoires" },
        { id: "cat-chemisiers",  name: "Chemisiers" },
    ]

    const sizeData = [
        { id: "size-s",  name: "S"  },
        { id: "size-m",  name: "M"  },
        { id: "size-l",  name: "L"  },
        { id: "size-xl", name: "XL" },
    ]

    const colorData = [
        { id: "color-black", name: "Noir"  },
        { id: "color-white", name: "Blanc" },
        { id: "color-red",   name: "Rouge" },
        { id: "color-blue",  name: "Bleu"  },
    ]

    const materialData = [
        { id: "mat-coton", name: "Coton" },
        { id: "mat-laine", name: "Laine" },
        { id: "mat-soie",  name: "Soie"  },
    ]

    await prisma.category.createMany({ data: categoryData })
    await prisma.size.createMany({ data: sizeData })
    await prisma.color.createMany({ data: colorData })
    await prisma.material.createMany({ data: materialData })

    // --- UTILISATEURS / CLIENTS / VENDEURS ---
    const password = await bcrypt.hash("wovelypass", 10)

    const clientInfos: Array<[string, string, string, string]> = [
        ["Alice",  "Durand",  "alice.durand@wovely.com",  "alice"  ],
        ["Camille","Petit",   "camille.petit@wovely.com", "camille"],
        ["Léa",    "Bernard", "lea.bernard@wovely.com",   "lea"    ],
        ["Nina",   "Giraud",  "nina.giraud@wovely.com",   "nina"   ],
        ["Sophie", "Lemoine", "sophie.lemoine@wovely.com","sophie" ],
        ["Emma",   "Roux",    "emma.roux@wovely.com",     "emma"   ],
        ["Julie",  "Fabre",   "julie.fabre@wovely.com",   "julie"  ],
        ["Clara",  "Noel",    "clara.noel@wovely.com",    "clara"  ],
        ["Chloé",  "Marchand","chloe.marchand@wovely.com","chloe"  ],
        ["Eva",    "Pires",   "eva.pires@wovely.com",     "eva"    ],
    ]

    const clients = []
    for (let i = 0; i < clientInfos.length; i++) {
        const [firstname, lastname, email, username] = clientInfos[i]
        const user = await prisma.user.create({
            data: { email, username, password, role: Role.CLIENT },
        })
        const client = await prisma.client.create({
            data: {
                firstname,
                lastname,
                phoneNumber: `060000000${i + 1}`,
                userId: user.id,
                agreeTerms: true,
                receiveAlerts: i % 2 === 0,
            },
        })
        clients.push(client)
    }

    const sellerInfos: Array<[string, string, string, string, string]> = [
        ["Marc",    "Dupont",  "Atelier Marc Couture", "marc@wovely.com",   "marc"   ],
        ["Julie",   "Tailleur","Maison Julie",         "julie@wovely.com",  "juliet" ],
        ["Antoine", "Blanc",   "Antoine Créations",    "antoine@wovely.com","antoine"],
        ["Sophie",  "Germain", "Sophie Design",        "sophie@wovely.com", "sophieg"],
        ["Lucas",   "Moreau",  "Couture Moreau",       "lucas@wovely.com",  "lucas"  ],
    ]

    const sellers = []
    for (let i = 0; i < sellerInfos.length; i++) {
        const [firstname, lastname, business_name, email, username] = sellerInfos[i]
        const user = await prisma.user.create({
            data: { email, username, password, role: Role.SELLER },
        })
        const seller = await prisma.seller.create({
            data: {
                business_name,
                fullName: `${firstname} ${lastname}`,
                phoneNumber: `070000000${i + 1}`,
                servicesOffered: "Création sur mesure, Retouche, Broderie",
                yearsOfExperience: `${i + 3}`,
                userId: user.id,
                agreeTerms: true,
                receiveAlerts: i % 2 === 1,
            },
        })
        sellers.push(seller)
    }

    // --- PRODUITS (+ images + stock par taille) ---
    const productData = [
        { name: "Veste Synthétique",         image: "vestesyntetic.webp",      price: "89.99",  category: "cat-costumes",   stock: [ { size: "size-s",  quantity: 5 }, { size: "size-m", quantity: 3 }, { size: "size-l", quantity: 2 } ] },
        { name: "Polo Noir",                 image: "polonoir.webp",           price: "29.99",  category: "cat-accessoires",stock: [ { size: "size-s",  quantity: 4 }, { size: "size-m", quantity: 6 }, { size: "size-l", quantity: 2 } ] },
        { name: "Veste Costume Gris",        image: "vestecostumegris.webp",   price: "149.99", category: "cat-costumes",   stock: [ { size: "size-m",  quantity: 2 }, { size: "size-l", quantity: 4 }, { size: "size-xl", quantity: 1 } ] },
        { name: "Robe Jean",                 image: "robejean.webp",           price: "59.99",  category: "cat-robes",      stock: [ { size: "size-s",  quantity: 3 }, { size: "size-m", quantity: 2 } ] },
        { name: "Poncho Laine",              image: "poncholaine.webp",        price: "69.99",  category: "cat-accessoires",stock: [ { size: "size-m",  quantity: 5 }, { size: "size-l", quantity: 3 } ] },
        { name: "T-Shirt Blanc 1",           image: "tshirtblanc1.webp",       price: "19.99",  category: "cat-tshirts",    stock: [ { size: "size-s",  quantity: 7 }, { size: "size-m", quantity: 5 }, { size: "size-l", quantity: 2 } ] },
        { name: "Veste Mouton",              image: "vestemouton.webp",        price: "119.99", category: "cat-costumes",   stock: [ { size: "size-l",  quantity: 2 }, { size: "size-xl", quantity: 2 } ] },
        { name: "Chemise Rouge et Blanche",  image: "chemiserougeblanc.webp",  price: "39.99",  category: "cat-chemisiers", stock: [ { size: "size-s",  quantity: 2 }, { size: "size-m", quantity: 2 }, { size: "size-l", quantity: 2 } ] },
        { name: "T-Shirt Blanc 5",           image: "tshirtblanc5.webp",       price: "17.99",  category: "cat-tshirts",    stock: [ { size: "size-s",  quantity: 4 }, { size: "size-m", quantity: 4 } ] },
        { name: "Veste Rouge",               image: "vesterouge.webp",         price: "99.99",  category: "cat-costumes",   stock: [ { size: "size-m",  quantity: 2 }, { size: "size-l", quantity: 2 } ] },
        { name: "T-Shirt Jaune",             image: "tshirtjaune.webp",        price: "21.99",  category: "cat-tshirts",    stock: [ { size: "size-s",  quantity: 3 }, { size: "size-m", quantity: 3 }, { size: "size-l", quantity: 3 } ] },
        { name: "Veste Jean",                image: "vestejean.webp",          price: "89.99",  category: "cat-costumes",   stock: [ { size: "size-m",  quantity: 2 }, { size: "size-l", quantity: 2 } ] },
        { name: "Veste Dickies",             image: "vestedickies.webp",       price: "109.99", category: "cat-costumes",   stock: [ { size: "size-l",  quantity: 2 }, { size: "size-xl", quantity: 1 } ] },
        { name: "T-Shirt Blanc 3",           image: "tshirtblanc3.webp",       price: "19.49",  category: "cat-tshirts",    stock: [ { size: "size-s",  quantity: 5 }, { size: "size-m", quantity: 5 } ] },
        { name: "Pantalon Beige",            image: "pantalonbeige.webp",      price: "49.99",  category: "cat-pantalons",  stock: [ { size: "size-m",  quantity: 2 }, { size: "size-l", quantity: 2 } ] },
        { name: "T-Shirt Blanc 4",           image: "tshirtblanc4.webp",       price: "18.99",  category: "cat-tshirts",    stock: [ { size: "size-s",  quantity: 2 }, { size: "size-m", quantity: 2 }, { size: "size-l", quantity: 2 } ] },
        { name: "Pull Laine Bleu",           image: "pulllainebleu.webp",      price: "79.99",  category: "cat-pulls",      stock: [ { size: "size-m",  quantity: 2 }, { size: "size-l", quantity: 2 } ] },
        { name: "Lot T-Shirt",               image: "lottshirt.webp",          price: "39.99",  category: "cat-tshirts",    stock: [ { size: "size-s",  quantity: 6 }, { size: "size-m", quantity: 6 } ] },
        { name: "Ensemble Jogging Jaune",    image: "ensemblejoggingjaune.webp",price: "89.99", category: "cat-pantalons",  stock: [ { size: "size-m",  quantity: 2 }, { size: "size-l", quantity: 2 } ] },
        { name: "T-Shirt Blanc 2",           image: "tshirtblanc2.webp",       price: "17.99",  category: "cat-tshirts",    stock: [ { size: "size-s",  quantity: 3 }, { size: "size-m", quantity: 3 } ] },
    ]

    const getRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

    for (let i = 0; i < productData.length; i++) {
        const p = productData[i]
        const product = await prisma.product.create({
            data: {
                name: p.name,
                description: `Produit unique : ${p.name}`,
                price: new Prisma.Decimal(p.price),
                sellerId: sellers[i % sellers.length].id,
                categoryId: p.category,
                colorId: getRandom(colorData).id,
                materialId: getRandom(materialData).id,
                images: { create: [{ url: `/seed-images/${p.image}` }] },
            },
            select: { id: true }, // <-- évite de SELECT un ancien champ (sizeId)
        })

        await prisma.productStock.createMany({
            data: p.stock.map(s => ({
                productId: product.id,
                sizeId: s.size,
                quantity: s.quantity,
            })),
        })
    }

    // --- PROJETS ---
    for (let i = 1; i <= 10; i++) {
        await prisma.project.create({
            data: {
                title: `Projet ${i} - Création personnalisée`,
                description: `Besoin spécifique pour un vêtement unique (${i}).`,
                clientId: clients[i % clients.length].id,
                images: [`https://example.com/projet${i}.jpg`],
            },
        })
    }

    // --- ANNONCES ---
    for (let i = 1; i <= 10; i++) {
        await prisma.advert.create({
            data: {
                title: `Annonce ${i} - Service couture`,
                description: `Annonce ${i} pour proposer un service personnalisé.`,
                price: new Prisma.Decimal(70 + i * 10),
                sellerId: sellers[i % sellers.length].id,
            },
        })
    }

    // (Optionnel) un panier de test pour vérifier la contrainte unique cartItem
    // await prisma.cartItem.create({
    //   data: {
    //     clientId: clients[0].id,
    //     productId: 1,
    //     sizeId: "size-m",
    //     quantity: 2,
    //   },
    // })

    console.log("✅ Seed Wovely terminé : catégories, tailles, couleurs, matières, 20 produits + stocks, 10 projets, 10 annonces.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
