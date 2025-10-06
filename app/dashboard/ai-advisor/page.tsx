import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db, query } from "@/lib/mysql";
import DashboardNav from "@/components/dashboard-nav"
import AIChat from "@/components/ai-chat"
import RecommendationCard from "@/components/recommendation-card"
import GenerateRecommendations from "@/components/generate-recommendations"
import { Brain } from "lucide-react"

interface Farm {
  id: string
  name: string
  location: string
}

interface Recommendation {
  id: string
  user_id: string
  message: string
  status: string
  created_at: string
}

export default async function AIAdvisorPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Récupération des fermes
  const farms = (await query(
    "SELECT id, name, location FROM farms WHERE user_id = ? ORDER BY name",
    [session.user.id]
  )) as Farm[] || []

  // Récupération des recommandations
  const recommendations = (await query(
    "SELECT * FROM ai_recommendations WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC",
    [session.user.id]
  )) as Recommendation[] || []

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        user={{
          email: session.user.email || "",
          full_name: session.user.name || "",
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 text-purple-600 mr-3" />
            Conseiller Agricole IA
          </h1>
          <p className="text-gray-600">
            Obtenez des recommandations intelligentes et posez vos questions sur vos activités agricoles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Recommandations */}
          <div className="lg:col-span-2 space-y-6">
            {farms.length > 0 && <GenerateRecommendations farms={farms} />}

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommandations Actives</h2>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune recommandation pour l’instant</h3>
                  <p className="text-gray-600">
                    {farms.length > 0
                      ? "Générez des recommandations IA pour vos fermes afin de commencer"
                      : "Ajoutez d’abord des fermes et des champs pour obtenir des recommandations personnalisées"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite - Chat IA */}
          <div>
            <AIChat />
          </div>
        </div>
      </main>
    </div>
  )
}
