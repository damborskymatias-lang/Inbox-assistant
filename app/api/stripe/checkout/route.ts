import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

// Inicializácia Stripe s tajným kľúčom z premenných prostredia
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vytvorenie Stripe Checkout Session pre mesačné predplatné
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID || "price_dummy",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL || "https://inbox-assistant.vercel.app"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || "https://inbox-assistant.vercel.app"}/dashboard?canceled=true`,
      customer_email: session.user.email,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
