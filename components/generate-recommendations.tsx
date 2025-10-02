"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, RefreshCw } from "lucide-react"
import { generateRecommendations } from "@/lib/ai-actions"

interface Farm {
  id: string
  name: string
  location: string
}

interface GenerateRecommendationsProps {
  farms: Farm[]
}

export default function GenerateRecommendations({ farms }: GenerateRecommendationsProps) {
  const [selectedFarm, setSelectedFarm] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null)

  const handleGenerate = async () => {
    if (!selectedFarm) return

    setIsGenerating(true)
    setResult(null)

    try {
      const response = await generateRecommendations(selectedFarm)
      setResult(response)
    } catch (error) {
      setResult({ success: false, error: "Échec de la génération des recommandations" })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
          Générer de nouvelles recommandations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sélectionner une ferme</label>
            <Select value={selectedFarm} onValueChange={setSelectedFarm}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez une ferme à analyser" />
              </SelectTrigger>
              <SelectContent>
                {farms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name} - {farm.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedFarm || isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse des données de la ferme...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Générer des recommandations IA
              </>
            )}
          </Button>

          {result && (
            <div
              className={`p-3 rounded-md text-sm ${
                result.success
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {result.success
                ? `Génération réussie de ${result.count} nouvelle(s) recommandation(s) !`
                : result.error || "Une erreur est survenue"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
