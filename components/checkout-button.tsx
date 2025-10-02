"use client"

import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/payment-actions"
import { CreditCard, Loader2 } from "lucide-react"
import { useState } from "react"

interface BoutonPaiementProps {
  orderId: string
  disabled?: boolean
}

export function BoutonPaiement({ orderId, disabled }: BoutonPaiementProps) {
  const [enChargement, setEnChargement] = useState(false)

  const gererPaiement = async () => {
    setEnChargement(true)
    try {
      await createCheckoutSession(orderId)
    } catch (error) {
      console.error("Erreur de paiement :", error)
      setEnChargement(false)
    }
  }

  return (
    <Button
      onClick={gererPaiement}
      disabled={disabled || enChargement}
      className="w-full bg-green-600 hover:bg-green-700"
      size="lg"
    >
      {enChargement ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirection vers le paiement...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Payer avec Stripe
        </>
      )}
    </Button>
  )
}
