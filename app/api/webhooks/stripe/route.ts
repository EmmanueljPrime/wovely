import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Gérer uniquement les paiements de produits
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const clientId = parseInt(session.metadata?.clientId || "0")
      const cartItemsIds = session.metadata?.cartItemsIds?.split(",").map(id => parseInt(id)) || []

      if (clientId && cartItemsIds.length > 0) {
        // Récupérer les articles du panier
        const cartItems = await prisma.cartItem.findMany({
          where: {
            id: { in: cartItemsIds },
            clientId: clientId
          },
          include: {
            product: {
              include: {
                stockBySize: true
              }
            }
          }
        })

        // Créer les commandes pour chaque article
        for (const cartItem of cartItems) {
          await prisma.order.create({
            data: {
              quantity: cartItem.quantity,
              totalPrice: Number(cartItem.product.price) * cartItem.quantity,
              status: "pending",
              paymentStatus: "paid",
              productId: cartItem.productId,
              clientId: clientId,
              sellerId: cartItem.product.sellerId
            }
          })

          // Décrémenter le stock
          const stock = cartItem.product.stockBySize.find(s => s.sizeId === cartItem.sizeId)
          if (stock) {
            await prisma.productStock.update({
              where: { id: stock.id },
              data: { quantity: Math.max(0, stock.quantity - cartItem.quantity) }
            })
          }
        }

        // Vider le panier
        await prisma.cartItem.deleteMany({
          where: {
            id: { in: cartItemsIds },
            clientId: clientId
          }
        })

        console.log(`✅ Commande produit créée avec succès pour le client ${clientId}`)
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Erreur webhook Stripe:", error)
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    )
  }
}
