"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, CheckCircle, Droplets, Leaf, Bug, Calendar, X } from "lucide-react"
import { dismissRecommendation } from "@/lib/ai-actions"

interface Recommendation {
  id: string
  type: string
  title: string
  content: string
  priority: "low" | "medium" | "high" | "urgent"
  created_at: string
  status: string
}

interface RecommendationCardProps {
  recommendation: Recommendation
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "irrigation":
        return <Droplets className="h-5 w-5 text-blue-600" />
      case "fertilization":
        return <Leaf className="h-5 w-5 text-green-600" />
      case "pest_control":
        return <Bug className="h-5 w-5 text-red-600" />
      case "harvest_timing":
        return <Calendar className="h-5 w-5 text-orange-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const handleDismiss = async () => {
    try {
      await dismissRecommendation(recommendation.id)
    } catch (error) {
      console.error("Erreur lors de la suppression de la recommandation :", error)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getTypeIcon(recommendation.type)}
            <div>
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getPriorityColor(recommendation.priority)}>
                  {getPriorityIcon(recommendation.priority)}
                  <span className="ml-1 capitalize">{recommendation.priority}</span>
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">
                  {recommendation.type.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">{recommendation.content}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(recommendation.created_at).toLocaleDateString()}</span>
            <span className="capitalize">{recommendation.status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
