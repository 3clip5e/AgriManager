import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Ruler, Droplets, Leaf, Eye } from "lucide-react"
import Link from "next/link"

interface Ferme {
  id: string
  name: string
  location: string
  total_area: number
  soil_type?: string
  irrigation_type?: string
  organic_certified: boolean
  fields: Array<{
    id: string
    name: string
    area: number
    plantings: Array<{
      id: string
      status: string
      crop_types: {
        name: string
        category: string
      }
    }>
  }>
}

interface CarteFermeProps {
  farm: Ferme
}

export default function CarteFerme({ farm }: CarteFermeProps) {
  const totalFields = farm.fields.length
  const activePlantings = farm.fields.reduce(
    (acc, field) => acc + (field.plantings?.filter((p) => p.status === "planted" || p.status === "growing").length || 0),
    0,
  )
  const utilizedArea = farm.fields.reduce(
    (acc, field) =>
      acc +
      (field.plantings
        ? field.plantings.reduce(
            (fieldAcc, planting) => fieldAcc + (planting.status === "planted" || planting.status === "growing" ? field.area : 0),
            0,
          )
        : 0),
    0,
  )

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-green-800">{farm.name}</CardTitle>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{farm.location}</span>
            </div>
          </div>
          {farm.organic_certified && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Leaf className="h-3 w-3 mr-1" />
              Biologique
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistiques de la ferme */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="flex items-center text-gray-600">
                <Ruler className="h-4 w-4 mr-1" />
                <span>Surface Totale</span>
              </div>
              <p className="font-semibold">{farm.total_area} ha</p>
            </div>
            <div>
              <p className="text-gray-600">Parcelles</p>
              <p className="font-semibold">{totalFields}</p>
            </div>
            <div>
              <p className="text-gray-600">Cultures Actives</p>
              <p className="font-semibold">{activePlantings}</p>
            </div>
          </div>

          {/* Détails de la ferme */}
          <div className="flex flex-wrap gap-2 text-xs">
            {farm.soil_type && (
              <Badge variant="outline" className="bg-transparent">
                Sol : {farm.soil_type}
              </Badge>
            )}
            {farm.irrigation_type && (
              <Badge variant="outline" className="bg-transparent">
                <Droplets className="h-3 w-3 mr-1" />
                {farm.irrigation_type}
              </Badge>
            )}
          </div>

          {/* Barre d’utilisation */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Utilisation du terrain</span>
              <span>{Math.round((utilizedArea / farm.total_area) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${Math.min((utilizedArea / farm.total_area) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link href={`/dashboard/fields/add-farm/${farm.id}`} className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Voir les détails
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
