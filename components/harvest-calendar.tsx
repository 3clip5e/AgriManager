import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Sprout } from "lucide-react"

interface Recolte {
  id: string
  cropName: string
  fieldName: string
  expectedDate: string
  area: number
  expectedYield: number
  status: string
}

interface CalendrierRecolteProps {
  harvests: Recolte[]
}

export default function CalendrierRecolte({ harvests }: CalendrierRecolteProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "planned":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready":
        return "Prête"
      case "soon":
        return "Bientôt"
      case "planned":
        return "Planifiée"
      default:
        return "Inconnue"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 text-green-600 mr-2" />
          Récoltes à venir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {harvests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sprout className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune récolte à venir</p>
              <p className="text-sm">Plantez des cultures pour voir le calendrier des récoltes</p>
            </div>
          ) : (
            harvests.map((harvest) => (
              <div key={harvest.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{harvest.cropName}</h4>
                    <p className="text-sm text-muted-foreground">{harvest.fieldName}</p>
                  </div>
                  <Badge className={getStatusColor(harvest.status)}>{getStatusLabel(harvest.status)}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date prévue</p>
                    <p className="font-medium">{harvest.expectedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Surface</p>
                    <p className="font-medium">{harvest.area} ha</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rendement attendu</p>
                    <p className="font-medium">{harvest.expectedYield} tonnes</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
