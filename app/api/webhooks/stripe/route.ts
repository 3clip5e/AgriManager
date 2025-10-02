import { stripe } from "@/lib/stripe"
import { db } from "@/lib/database"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const orderId = session.metadata?.order_id

      if (orderId) {
        await db.execute(`UPDATE orders SET status = 'paid', payment_id = ?, updated_at = NOW() WHERE id = ?`, [
          session.payment_intent as string,
          orderId,
        ])
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
