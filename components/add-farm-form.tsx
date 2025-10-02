"use client"

import { useState, FormEvent, startTransition } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MapPin } from "lucide-react"
import { useRouter } from 'next/navigation'
import { createFarm } from "@/lib/field-actions"

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Création de la ferme...
        </>
      ) : (
        "Créer la ferme"
      )}
    </Button>
  )
}

export default function AddFarmForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setPending(true)
    setError(null)
    try {
      await createFarm(formData)
      router.push('/dashboard/fields')
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 text-green-600 mr-2" />
          Ajouter une nouvelle ferme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            handleSubmit(data)
          }}
          className="space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la ferme *</Label>
              <Input id="name" name="name" placeholder="Ma ferme" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input id="location" name="location" placeholder="Ville, Région" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalArea">Superficie totale (hectares) *</Label>
              <Input id="totalArea" name="totalArea" type="number" step="0.1" placeholder="10.5" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilType">Type de sol</Label>
              <Select name="soilType">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de sol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Argileux</SelectItem>
                  <SelectItem value="sandy">Sableux</SelectItem>
                  <SelectItem value="loamy">Limoneux</SelectItem>
                  <SelectItem value="silty">Limon fin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="irrigationType">Type d’irrigation</Label>
              <Select name="irrigationType">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type d’irrigation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drip">Goutte-à-goutte</SelectItem>
                  <SelectItem value="sprinkler">Aspersion</SelectItem>
                  <SelectItem value="flood">Irrigation par inondation</SelectItem>
                  <SelectItem value="none">Aucune irrigation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="organicCertified" name="organicCertified" />
              <Label htmlFor="organicCertified">Certifiée biologique</Label>
            </div>
          </div>

          <SubmitButton pending={pending} />
        </form>
      </CardContent>
    </Card>
  )
}
