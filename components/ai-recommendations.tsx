import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface Recommendation {
  id: string
  type: string
  title: string
  content: string
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: string
}

interface AIRecommendationsProps {
  recommendations: Recommendation[]
}

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          Recommandations IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune recommandation pour le moment</p>
              <p className="text-sm">Revenez plus tard pour des conseils générés par l’IA</p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {getPriorityIcon(rec.priority)}
                        <span className="ml-1 capitalize">{rec.priority}</span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">{rec.type}</span>
                    </div>
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rec.content}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{rec.createdAt}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      Ignorer
                    </Button>
                    <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700">
                      Voir les détails
                    </Button>
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
