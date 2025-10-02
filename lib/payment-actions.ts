"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/database"
import { stripe, formatAmountForStripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function createCheckoutSession(orderId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  try {
    // Get order details with items and products
    const [orderRows] = await db.query(
      `SELECT o.*, 
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', oi.id,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'total_price', oi.total_price,
                  'products', JSON_OBJECT(
                    'id', p.id,
                    'name', p.name,
                    'description', p.description
                  )
                )
              ) as order_items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ?
       GROUP BY o.id`,
      [orderId],
    )

    const order = (orderRows as any[])[0]
    if (!order) {
      throw new Error("Order not found")
    }

    // Parse JSON order_items
    order.order_items = JSON.parse(order.order_items)

    const origin = headers().get("origin")

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.order_items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.products.name,
            description: item.products.description,
          },
          unit_amount: formatAmountForStripe(item.unit_price),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${origin}/marketplace/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/marketplace/${order.order_items[0].products.id}`,
      metadata: {
        order_id: orderId,
      },
    })

    redirect(stripeSession.url!)
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function confirmPayment(sessionId: string, orderId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Update order status
      await db.query(`UPDATE orders SET status = 'paid', payment_id = ?, updated_at = NOW() WHERE id = ?`, [
        session.payment_intent as string,
        orderId,
      ])

      return { success: true, session }
    }

    return { success: false, session }
  } catch (error) {
    console.error("Error confirming payment:", error)
    throw new Error("Failed to confirm payment")
  }
}
