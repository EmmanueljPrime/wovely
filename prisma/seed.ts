// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
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
  await prisma.user.deleteMany()

  console.log("Données existantes supprimées")

  const categoryData = [
    { id: 'cat-robes', name: "Robes" },
    { id: 'cat-costumes', name: "Costumes" },
    { id: 'cat-tshirts', name: "T-shirts" },
    { id: 'cat-pantalons', name: "Pantalons" },
    { id: 'cat-pulls', name: "Pulls" },
    { id: 'cat-accessoires', name: "Accessoires" },
    { id: 'cat-chemisiers', name: "Chemisiers" },
  ]

  const sizeData = [
    { id: 'size-s', name: "S" },
    { id: 'size-m', name: "M" },
    { id: 'size-l', name: "L" },
    { id: 'size-xl', name: "XL" },
  ]

  const colorData = [
    { id: 'color-black', name: "Noir" },
    { id: 'color-white', name: "Blanc" },
    { id: 'color-red', name: "Rouge" },
    { id: 'color-blue', name: "Bleu" },
  ]

  const materialData = [
    { id: 'mat-coton', name: "Coton" },
    { id: 'mat-laine', name: "Laine" },
    { id: 'mat-soie', name: "Soie" },
  ]

  await prisma.category.createMany({ data: categoryData })
  await prisma.size.createMany({ data: sizeData })
  await prisma.color.createMany({ data: colorData })
  await prisma.material.createMany({ data: materialData })

  const password = await bcrypt.hash("wovelypass", 10)

  const clientInfos = [
    ["Alice", "Durand", "alice.durand@wovely.com", "alice"],
    ["Camille", "Petit", "camille.petit@wovely.com", "camille"],
    ["Léa", "Bernard", "lea.bernard@wovely.com", "lea"],
    ["Nina", "Giraud", "nina.giraud@wovely.com", "nina"],
    ["Sophie", "Lemoine", "sophie.lemoine@wovely.com", "sophie"],
    ["Emma", "Roux", "emma.roux@wovely.com", "emma"],
    ["Julie", "Fabre", "julie.fabre@wovely.com", "julie"],
    ["Clara", "Noel", "clara.noel@wovely.com", "clara"],
    ["Chloé", "Marchand", "chloe.marchand@wovely.com", "chloe"],
    ["Eva", "Pires", "eva.pires@wovely.com", "eva"]
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

  const sellerInfos = [
    ["Marc", "Dupont", "Atelier Marc Couture", "marc@wovely.com", "marc"],
    ["Julie", "Tailleur", "Maison Julie", "julie@wovely.com", "juliet"],
    ["Antoine", "Blanc", "Antoine Créations", "antoine@wovely.com", "antoine"],
    ["Sophie", "Germain", "Sophie Design", "sophie@wovely.com", "sophieg"],
    ["Lucas", "Moreau", "Couture Moreau", "lucas@wovely.com", "lucas"]
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

  const productData = [
    { name: "Veste Synthétique", image: "vestesyntetic.jpg", price: 89.99, category: 'cat-costumes' },
    { name: "Polo Noir", image: "polonoir.jpg", price: 29.99, category: 'cat-accessoires' },
    { name: "Veste Costume Gris", image: "vestecostumegris.jpg", price: 149.99, category: 'cat-costumes' },
    { name: "Robe Jean", image: "robejean.jpg", price: 59.99, category: 'cat-robes' },
    { name: "Poncho Laine", image: "poncholaine.jpg", price: 69.99, category: 'cat-accessoires' },
    { name: "T-Shirt Blanc 1", image: "tshirtblanc1.jpg", price: 19.99, category: 'cat-tshirts' },
    { name: "Veste Mouton", image: "vestemouton.jpg", price: 119.99, category: 'cat-costumes' },
    { name: "Chemise Rouge et Blanche", image: "chemiserougeblanc.jpg", price: 39.99, category: 'cat-chemisiers' },
    { name: "T-Shirt Blanc 5", image: "tshirtblanc5.jpg", price: 17.99, category: 'cat-tshirts' },
    { name: "Veste Rouge", image: "vesterouge.jpg", price: 99.99, category: 'cat-costumes' },
    { name: "T-Shirt Jaune", image: "tshirtjaune.jpg", price: 21.99, category: 'cat-tshirts' },
    { name: "Veste Jean", image: "vestejean.jpg", price: 89.99, category: 'cat-costumes' },
    { name: "Veste Dickies", image: "vestedickies.jpg", price: 109.99, category: 'cat-costumes' },
    { name: "T-Shirt Blanc 3", image: "tshirtblanc3.jpg", price: 19.49, category: 'cat-tshirts' },
    { name: "Pantalon Beige", image: "pantalonbeige.jpg", price: 49.99, category: 'cat-pantalons' },
    { name: "T-Shirt Blanc 4", image: "tshirtblanc4.jpg", price: 18.99, category: 'cat-tshirts' },
    { name: "Pull Laine Bleu", image: "pulllainebleu.jpg", price: 79.99, category: 'cat-pulls' },
    { name: "Lot T-Shirt", image: "lottshirt.jpg", price: 39.99, category: 'cat-tshirts' },
    { name: "Ensemble Jogging Jaune", image: "ensemblejoggingjaune.jpg", price: 89.99, category: 'cat-pantalons' },
    { name: "T-Shirt Blanc 2", image: "tshirtblanc2.jpg", price: 17.99, category: 'cat-tshirts' },
  ]

  const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

  for (let i = 0; i < productData.length; i++) {
    const p = productData[i]
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: `Produit unique : ${p.name}`,
        price: p.price,
        sellerId: sellers[i % sellers.length].id,
        categoryId: p.category,
        colorId: getRandom(colorData).id,
        materialId: getRandom(materialData).id,
        images: {
          create: [{ url: `/seed-images/${p.image}` }]
        }
      }
    })

    await prisma.productStock.createMany({
      data: sizeData.map(size => ({
        productId: product.id,
        sizeId: size.id,
        quantity: Math.floor(Math.random() * 10) + 1
      }))
    })
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.project.create({
      data: {
        title: `Projet ${i} - Création personnalisée`,
        description: `Besoin spécifique pour un vêtement unique (${i}).`,
        clientId: clients[i % clients.length].id,
        images: [`https://example.com/projet${i}.jpg`]
      }
    })
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.advert.create({
      data: {
        title: `Annonce ${i} - Service couture`,
        description: `Annonce ${i} pour proposer un service personnalisé.`,
        price: 70 + (i * 10),
        sellerId: sellers[i % sellers.length].id,
      }
    })
  }

  console.log("✅ Base Wovely complétée avec 20 produits illustrés localement et variantes de taille.")
}

main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
