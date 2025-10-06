"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Sprout, Users, ShoppingCart } from "lucide-react"
import Link from "next/link"
import {cn} from "@/lib/utils"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Création du compte...
        </>
      ) : (
        "Créer un compte"
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, setState] = useState<{ error?: string; success?: string } | null>(null)
  const [userType, setUserType] = useState<'farmer' | 'buyer'>('farmer')


  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: fullName, userType }),
      })

      const data = await response.json()

      if (!response.ok) {
        setState({ error: data.error })
      } else {
        setState({ success: "Compte créé avec succès. Veuillez vous connecter." })
      }
    } catch (error) {
      setState({ error: "Une erreur inattendue est survenue" })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Sprout className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">Rejoignez AgriManager</CardTitle>
        <CardDescription>Créez votre compte pour commencer à gérer votre ferme</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)) }}>
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Je suis un...
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('buyer')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all",
                    userType === 'buyer'
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <ShoppingCart className={cn(
                    "h-8 w-8",
                    userType === 'buyer' ? "text-green-600" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-medium",
                    userType === 'buyer' ? "text-green-900" : "text-gray-700"
                  )}>
                    Client
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    Acheter des produits
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('farmer')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all",
                    userType === 'farmer'
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Users className={cn(
                    "h-8 w-8",
                    userType === 'farmer' ? "text-green-600" : "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-medium",
                    userType === 'farmer' ? "text-green-900" : "text-gray-700"
                  )}>
                    Agriculteur
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    Gérer et vendre
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <Input id="fullName" name="fullName" type="text" placeholder="Jean Dupont" required className="w-full" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="fermier@example.com" required className="w-full" />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <Input id="password" name="password" type="password" required className="w-full" minLength={6} />
          </div>

          <SubmitButton />

          <div className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
              Connectez-vous
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
