import { db } from "@/lib/database"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Leaf, ShoppingCart, User } from "lucide-react"
import Link from "next/link"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const [productRows] = await db.execute(
    `SELECT p.*, u.name as seller_name, u.email as seller_email
     FROM products p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = ?`,
    [params.id],
  )

  const products = productRows as any[]
  const product = products[0]

  if (!product) {
    notFound()
  }

  const isAvailable = product.status === "available" && product.quantity_available > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/marketplace">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Placeholder */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Leaf className="h-24 w-24 text-green-600 mx-auto mb-4" />
                <p className="text-green-800 font-medium">{product.name}</p>
                <p className="text-green-600 text-sm">Fresh & Organic</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>                             
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-transparent">
                      {product.category}
                    </Badge>
                    {product.organic_certified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                    <Badge className={isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {isAvailable ? "In Stock" : "Sold Out"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-green-600">€{product.price_per_unit}</p>
                  <p className="text-gray-600">per {product.unit}</p>
                </div>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Available Quantity:</span>
                    <p className="font-medium">
                      {product.quantity_available} {product.unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Unit:</span>
                    <p className="font-medium">{product.unit}</p>
                  </div>
                  {product.harvest_date && (
                    <div>
                      <span className="text-gray-600">Harvest Date:</span>
                      <p className="font-medium">{new Date(product.harvest_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {product.expiry_date && (
                    <div>
                      <span className="text-gray-600">Best By:</span>
                      <p className="font-medium">{new Date(product.expiry_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Seller Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-20">Name:</span>
                    <span className="font-medium">{product.seller_name || "Local Farmer"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Button */}
            <div className="flex gap-4">
              {isAvailable ? (
                <Link href={`/marketplace/${product.id}/order`} className="flex-1">
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Order Now
                  </Button>
                </Link>
              ) : (
                <Button size="lg" disabled className="flex-1">
                  Currently Unavailable
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
