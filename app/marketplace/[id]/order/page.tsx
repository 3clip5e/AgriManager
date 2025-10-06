import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/database"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import OrderForm from "@/components/order-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CheckoutButton } from "@/components/checkout-button"

export default async function MarketplacePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

export default async function OrderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/login")
  }

  const [productRows] = await db.execute(
    "SELECT id, name, price_per_unit, unit, quantity_available, status FROM products WHERE id = ?",
    [params.id],
  )

  const products = productRows as any[]
  const product = products[0]

  if (!product) {
    notFound()
  }

  const isAvailable = product.status === "available" && product.quantity_available > 0

  if (!isAvailable) {
    redirect(`/marketplace/${params.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/marketplace/${params.id}`}>
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </Button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Place Your Order</h1>
          <p className="text-gray-600">Complete your purchase and get fresh produce delivered</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <OrderForm product={product} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Product:</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per {product.unit}:</span>
                <span>€{product.price_per_unit}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Complete the form on the left, then proceed to secure payment with Stripe.
              </p>
              <CheckoutButton orderId={""} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
