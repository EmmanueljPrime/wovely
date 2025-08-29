import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const client = await prisma.client.findUnique({
      where: { userId }
    })

    if (!client) {
      return NextResponse.json(
        { error: "Profil client non trouvé" },
        { status: 404 }
      )
    }

    // Récupérer les articles du panier
    const cartItems = await prisma.cartItem.findMany({
      where: { clientId: client.id },
      include: {
        product: {
          include: {
            images: true,
            seller: {
              include: {
                user: true
              }
            }
          }
        },
        size: true
      }
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      )
    }

    // Calculer le total
    const total = cartItems.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity)
    }, 0)

    // Créer les line items pour Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          description: `Taille: ${item.size.name} - Vendeur: ${item.product.seller.user.username}`,
          images: item.product.images.length > 0 ? [
            `${process.env.NEXTAUTH_URL}${item.product.images[0].url}`
          ] : [],
        },
        unit_amount: Math.round(Number(item.product.price) * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }))

    // Créer la session Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        clientId: client.id.toString(),
        cartItemsIds: cartItems.map(item => item.id).join(',')
      },
      customer_email: session.user.email!,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'DE', 'ES', 'IT', 'NL', 'PT'],
      },
      billing_address_collection: 'required',
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    })

  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
