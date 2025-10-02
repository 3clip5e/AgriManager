import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Leaf, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description?: string
  category: string
  price_per_unit: number
  unit: string
  quantity_available: number
  harvest_date?: string
  expiry_date?: string
  organic_certified: boolean
  status: string
  profiles?: {
    full_name?: string
    farm_name?: string
    city?: string
  }
}

interface ProductCardProps {
  product: Product
  showActions?: boolean
}

export default function ProductCard({ product, showActions = true }: ProductCardProps) {
  const isAvailable = product.status === "available" && product.quantity_available > 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-green-800">{product.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-transparent">
                {product.category}
              </Badge>
              {product.organic_certified && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">€{product.price_per_unit}</p>
            <p className="text-sm text-gray-600">per {product.unit}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Description */}
          {product.description && <p className="text-sm text-gray-700">{product.description}</p>}

          {/* Seller Info */}
          {product.profiles && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {product.profiles.farm_name || product.profiles.full_name}
                {product.profiles.city && ` • ${product.profiles.city}`}
              </span>
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="text-gray-600">Available:</span>
              <span className="ml-1 font-medium">
                {product.quantity_available} {product.unit}
              </span>
            </div>
            <Badge className={isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {isAvailable ? "In Stock" : "Sold Out"}
            </Badge>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            {product.harvest_date && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Harvested: {new Date(product.harvest_date).toLocaleDateString()}</span>
              </div>
            )}
            {product.expiry_date && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Best by: {new Date(product.expiry_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Link href={`/marketplace/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </Link>
              {isAvailable && (
                <Link href={`/marketplace/${product.id}/order`} className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order Now
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
