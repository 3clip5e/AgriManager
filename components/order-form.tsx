"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShoppingCart } from "lucide-react"
import { createOrder } from "@/lib/marketplace-actions"
import { CheckoutButton } from "@/components/checkout-button"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price_per_unit: number
  unit: string
  quantity_available: number
}

interface OrderFormProps {
  product: Product
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Commande en cours...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Passer la commande
        </>
      )}
    </Button>
  )
}

export default function OrderForm({ product }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [state, formAction] = useActionState(createOrder, null)

  const totalPrice = quantity * product.price_per_unit

  if (state?.success && state?.orderId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">Commande créée avec succès !</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Votre commande a été créée. Procédez au paiement pour finaliser votre achat.
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Résumé de la commande</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Produit :</span>
                <span>{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantité :</span>
                <span>
                  {quantity} {product.unit}
                </span>
              </div>
              <div className="flex justify-between font-medium text-base border-t pt-1">
                <span>Total :</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <CheckoutButton orderId={state.orderId} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
          Commander {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="productId" value={product.id} />

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {state.error}
            </div>
          )}

          {/* Résumé de la commande */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Résumé de la commande</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Produit :</span>
                <span>{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Prix par {product.unit} :</span>
                <span>€{product.price_per_unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantité :</span>
                <span>
                  {quantity} {product.unit}
                </span>
              </div>
              <div className="flex justify-between font-medium text-base border-t pt-1">
                <span>Total :</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité ({product.unit}) *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max={product.quantity_available}
                value={quantity}
                onChange={(e) => setQuantity(Number.parseFloat(e.target.value) || 1)}
                required
              />
              <p className="text-xs text-gray-600">
                Disponible : {product.quantity_available} {product.unit}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress">Adresse de livraison *</Label>
              <Textarea
                id="shippingAddress"
                name="shippingAddress"
                placeholder="Entrez votre adresse complète de livraison..."
                rows={4}
                required
              />
            </div>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
