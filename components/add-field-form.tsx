"use client"

// import {  } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Square } from "lucide-react"
import { createField } from "@/lib/field-actions"
import { db } from "@/lib/mysql";

interface Farm {
  id: string
  name: string
}

interface AddFieldFormProps {
  farms: Farm[]
}


function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Création de la parcelle...
        </>
      ) : (
        "Créer la parcelle"
      )}
    </Button>
  )
}

export default function AddFieldForm({ farms }: AddFieldFormProps) {
  const [state, formAction] = useFormState(createField, null)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Square className="h-5 w-5 text-green-600 mr-2" />
          Ajouter une nouvelle parcelle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="farmId">Ferme *</Label>
              <Select name="farmId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ferme" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id}>
                      {farm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom de la parcelle *</Label>
              <Input id="name" name="name" placeholder="Parcelle Nord" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Superficie (hectares) *</Label>
              <Input id="area" name="area" type="number" step="0.1" placeholder="2.5" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilPh">pH du sol</Label>
              <Input id="soilPh" name="soilPh" type="number" step="0.1" min="0" max="14" placeholder="6.5" />
            </div>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
