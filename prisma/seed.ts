import { PrismaClient, Role } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.order.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.advert.deleteMany()
  await prisma.project.deleteMany()
  await prisma.image.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.seller.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  console.log("Cleared existing data")

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Shirts" } }),
    prisma.category.create({ data: { name: "Pants" } }),
    prisma.category.create({ data: { name: "Dresses" } }),
    prisma.category.create({ data: { name: "Suits" } }),
    prisma.category.create({ data: { name: "Accessories" } }),
  ])

  console.log("Created categories")

  // Hash password
  const password = await bcrypt.hash("password123", 10)

  // Create client users
  const clientUser1 = await prisma.user.create({
    data: {
      email: "client1@example.com",
      username: "client1",
      password,
      role: Role.CLIENT,
    },
  })

  const clientUser2 = await prisma.user.create({
    data: {
      email: "client2@example.com",
      username: "client2",
      password,
      role: Role.CLIENT,
    },
  })

  // Create client profiles
  const client1 = await prisma.client.create({
    data: {
      firstname: "John",
      lastname: "Doe",
      userId: clientUser1.id,
    },
  })

  const client2 = await prisma.client.create({
    data: {
      firstname: "Jane",
      lastname: "Smith",
      userId: clientUser2.id,
    },
  })

  console.log("Created client users")

  // Create seller users
  const sellerUser1 = await prisma.user.create({
    data: {
      email: "seller1@example.com",
      username: "seller1",
      password,
      role: Role.SELLER,
    },
  })

  const sellerUser2 = await prisma.user.create({
    data: {
      email: "seller2@example.com",
      username: "seller2",
      password,
      role: Role.SELLER,
    },
  })

  // Create seller profiles
  const seller1 = await prisma.seller.create({
    data: {
      business_name: "Elite Tailors",
      userId: sellerUser1.id,
    },
  })

  const seller2 = await prisma.seller.create({
    data: {
      business_name: "Fashion Masters",
      userId: sellerUser2.id,
    },
  })

  console.log("Created seller users")

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: "Custom Suit",
      description: "Handmade custom suit tailored to your measurements",
      price: 599.99,
      stock: 10,
      sellerId: seller1.id,
      categories: {
        connect: [{ id: categories[3].id }], // Suits
      },
      images: {
        create: [{ url: "https://example.com/images/suit1.jpg" }, { url: "https://example.com/images/suit2.jpg" }],
      },
    },
  })

  const product2 = await prisma.product.create({
    data: {
      name: "Dress Shirt",
      description: "Premium cotton dress shirt",
      price: 89.99,
      stock: 25,
      sellerId: seller1.id,
      categories: {
        connect: [{ id: categories[0].id }], // Shirts
      },
      images: {
        create: [{ url: "https://example.com/images/shirt1.jpg" }],
      },
    },
  })

  const product3 = await prisma.product.create({
    data: {
      name: "Evening Dress",
      description: "Elegant evening dress for special occasions",
      price: 299.99,
      stock: 5,
      sellerId: seller2.id,
      categories: {
        connect: [{ id: categories[2].id }], // Dresses
      },
      images: {
        create: [{ url: "https://example.com/images/dress1.jpg" }, { url: "https://example.com/images/dress2.jpg" }],
      },
    },
  })

  console.log("Created products")

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: "Wedding Suit",
      description: "Need a custom suit for my wedding in 3 months",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      clientId: client1.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: "Business Shirts",
      description: "Looking for 5 custom business shirts",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      clientId: client2.id,
    },
  })

  console.log("Created projects")

  // Create adverts
  const advert1 = await prisma.advert.create({
    data: {
      title: "Custom Suit Making",
      description: "Professional tailor offering custom suit making services",
      price: 500.0,
      sellerId: seller1.id,
    },
  })

  const advert2 = await prisma.advert.create({
    data: {
      title: "Dress Alterations",
      description: "Expert dress alterations and customizations",
      price: 150.0,
      sellerId: seller2.id,
    },
  })

  console.log("Created adverts")

  // Create proposals
  const proposal1 = await prisma.proposal.create({
    data: {
      price: 550.0,
      message: "I can create a perfect wedding suit for you",
      projectId: project1.id,
      sellerId: seller1.id,
      advertId: advert1.id,
    },
  })

  const proposal2 = await prisma.proposal.create({
    data: {
      price: 400.0,
      message: "I can make 5 high-quality business shirts",
      projectId: project2.id,
      sellerId: seller1.id,
      advertId: advert1.id,
    },
  })

  console.log("Created proposals")

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      quantity: 1,
      totalPrice: product1.price.toNumber(),
      productId: product1.id,
      clientId: client1.id,
      sellerId: seller1.id,
    },
  })

  const order2 = await prisma.order.create({
    data: {
      quantity: 2,
      totalPrice: product3.price.toNumber() * 2,
      productId: product3.id,
      clientId: client2.id,
      sellerId: seller2.id,
    },
  })

  console.log("Created orders")

  // Create messages
  await prisma.message.create({
    data: {
      content: "Hello, I'm interested in your services",
      senderId: clientUser1.id,
      recipientId: sellerUser1.id,
    },
  })

  await prisma.message.create({
    data: {
      content: "Thank you for your interest. How can I help you?",
      senderId: sellerUser1.id,
      recipientId: clientUser1.id,
    },
  })

  console.log("Created messages")

  // Create notifications
  await prisma.notification.create({
    data: {
      content: "You have a new proposal for your project",
      userId: clientUser1.id,
    },
  })

  await prisma.notification.create({
    data: {
      content: "Your order has been shipped",
      userId: clientUser2.id,
    },
  })

  console.log("Created notifications")

  console.log("Seed data created successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
