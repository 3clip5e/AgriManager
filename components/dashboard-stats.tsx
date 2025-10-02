import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Sprout, TrendingUp, AlertTriangle } from "lucide-react"

interface TableauStatsProps {
  stats: {
    totalFarms: number
    activePlantings: number
    totalRevenue: number
    pendingRecommendations: number
  }
}

export default function TableauStats({ stats }: TableauStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fermes totales</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFarms}</div>
          <p className="text-xs text-muted-foreground">Emplacements actifs</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cultures actives</CardTitle>
          <Sprout className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activePlantings}</div>
          <p className="text-xs text-muted-foreground">En cours de croissance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Ce mois-ci</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alertes IA</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingRecommendations}</div>
          <p className="text-xs text-muted-foreground">Recommandations en attente</p>
        </CardContent>
      </Card>
    </div>
  )
}
