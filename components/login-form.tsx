"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sprout } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connexion en cours...
        </>
      ) : (
        "Se connecter"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, setState] = useState<{ error?: string } | null>(null)

       // Dans LoginForm (extrait handleSubmit seulement – gardez reste identique)
     const handleSubmit = async (formData: FormData) => {
       setState(null);  // Reset
       const email = formData.get("email") as string;
       const password = formData.get("password") as string;

       try {
         console.log("🔍 Client: signIn pour", email);  // Debug client
         const result = await signIn("credentials", {
           email,
           password,
           redirect: false,
         });

         if (result?.error) {
           console.error("🔍 Client Error:", result.error);  // e.g., "CredentialsSignin"
           setState({ error: result.error === "CredentialsSignin" ? "Identifiants invalides" : result.error });
           return;
         }

         if (result?.ok) {
           console.log("✅ Client: SignIn OK, push /dashboard (middleware rôle)");
           router.push("/dashboard");  // Middleware check token.role → /marketplace si buyer
           router.refresh();  // Update session
         }
       } catch (error) {
         console.error("❌ Client Catch:", error);  // Si throw inattendu
         setState({ error: "Une erreur inattendue est survenue. Vérifiez console." });
       }
     };
     

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Sprout className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">Bienvenue</CardTitle>
        <CardDescription>Connectez-vous à votre compte de gestion agricole</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(new FormData(e.currentTarget))
          }}
          className="space-y-4"
        >
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {state.error}
            </div>
          )}

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
            <Input id="password" name="password" type="password" required className="w-full" />
          </div>

          <SubmitButton />

          <div className="text-center text-sm text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <Link href="/auth/sign-up" className="text-green-600 hover:text-green-700 font-medium">
              Inscrivez-vous
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
