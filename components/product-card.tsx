// components/product-card.tsx (Version complète pour marketplace)
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity_available: number;
  image_url?: string;
  organic_certified?: boolean;
  status: string;
  seller_name?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.status === "available" && product.quantity_available > 0;
  const imageSrc = product.image_url || "/placeholder.jpg";  // Fallback image

  return (
    <Card className="w-full h-full group hover:shadow-lg transition-shadow">
      <CardHeader className="p-0 relative overflow-hidden rounded-t-lg">
        <div className="aspect-square relative bg-gray-100 group-hover:scale-105 transition-transform">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.organic_certified && (
            <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-200">
              <Leaf className="h-3 w-3 mr-1" />
              Bio
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold leading-tight">{product.name}</CardTitle>
            <Badge variant="outline" className="mt-1 text-xs">
              {product.category}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              €{product.price_per_unit.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">{product.unit}</p>
          </div>
        </div>

        {product.description && (
          <CardDescription className="text-sm line-clamp-2">
            {product.description}
          </CardDescription>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Stock: {product.quantity_available} {product.unit}</span>
          <span className={isAvailable ? "text-green-600" : "text-red-600"}>
            {isAvailable ? "Disponible" : "Épuisé"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isAvailable ? (
          <Link href={`/marketplace/${product.id}`}>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Commander
            </Button>
          </Link>
        ) : (
          <Button className="w-full" disabled>
            Indisponible
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
