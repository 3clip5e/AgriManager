import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import DashboardStats from "@/components/dashboard-stats"
import WeatherWidget from "@/components/weather-widget"
import AIRecommendations from "@/components/ai-recommendations"
import HarvestCalendar from "@/components/harvest-calendar"
import QuickActions from "@/components/quick-actions"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Si aucun utilisateur, rediriger vers la page de connexion
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Données factices pour la démonstration (dans l’app réelle, récupérer depuis la base de données)
  const stats = {
    totalFarms: 3,
    activePlantings: 12,
    totalRevenue: 15420,
    pendingRecommendations: 4,
  }

  const weather = {
    temperature: 22,
    humidity: 65,
    rainfall: 2.5,
    windSpeed: 12,
    conditions: "ensoleillé",
    forecast: [
      { date: "Demain", temp: 24, conditions: "ensoleillé" },
      { date: "Jeudi", temp: 19, conditions: "nuageux" },
      { date: "Vendredi", temp: 21, conditions: "pluvieux" },
    ],
  }

  const recommendations = [
    {
      id: "1",
      type: "irrigation",
      title: "Augmenter l’arrosage des tomates",
      content:
        "D’après les prévisions météo et l’humidité du sol, votre champ de tomates a besoin d’un arrosage supplémentaire.",
      priority: "high" as const,
      createdAt: "il y a 2 heures",
    },
    {
      id: "2",
      type: "fertilization",
      title: "Appliquer de l’engrais azoté",
      content:
        "Le champ de maïs montre des signes de carence en azote. Pensez à appliquer de l’engrais cette semaine.",
      priority: "medium" as const,
      createdAt: "il y a 1 jour",
    },
  ]

  const harvests = [
    {
      id: "1",
      cropName: "Tomates",
      fieldName: "Champ Nord",
      expectedDate: "25 août 2024",
      area: 2.5,
      expectedYield: 8.5,
      status: "prêt",
    },
    {
      id: "2",
      cropName: "Maïs",
      fieldName: "Champ Sud",
      expectedDate: "10 septembre 2024",
      area: 5.0,
      expectedYield: 25.0,
      status: "bientôt",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        user={{
          email: session.user.email || "",
          full_name: session.user.name,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">
            Bon retour ! Voici ce qui se passe sur votre ferme.
          </p>
        </div>

        {/* Vue d’ensemble des statistiques */}
        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>

        {/* Grille du contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommandations IA */}
            <AIRecommendations recommendations={recommendations} />

            {/* Calendrier des récoltes */}
            <HarvestCalendar harvests={harvests} />
          </div>

          {/* Colonne de droite */}
          <div className="space-y-8">
            {/* Widget météo */}
            <WeatherWidget weather={weather} />

            {/* Actions rapides */}
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
