import { confirmPayment } from "@/lib/payment-actions"
import { db } from "@/lib/database"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { redirect } from "next/navigation"

interface PaymentSuccessPageProps {
  searchParams: {
    session_id?: string
    order_id?: string
  }
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const { session_id, order_id } = searchParams

  if (!session_id || !order_id) {
    redirect("/marketplace")
  }

  try {
    const { success } = await confirmPayment(session_id, order_id)

    if (!success) {
      redirect("/marketplace")
    }

    const [orderRows] = await db.execute(
      `SELECT o.*, 
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', oi.id,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'total_price', oi.total_price,
                  'products', JSON_OBJECT(
                    'name', p.name
                  )
                )
              ) as order_items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ?
       GROUP BY o.id`,
      [order_id],
    )

    const orders = orderRows as any[]
    const order = orders[0]
    if (order?.order_items) {
      order.order_items = JSON.parse(order.order_items)
    }

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your order. Your payment has been processed successfully.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{order?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">€{order?.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">Paid</span>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Items Ordered:</h3>
                <div className="space-y-2">
                  {order?.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.products.name} x {item.quantity}
                      </span>
                      <span>€{item.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">
              You will receive an email confirmation shortly. The seller will contact you regarding delivery
              arrangements.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/marketplace">Continue Shopping</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    redirect("/marketplace")
  }
}
