import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getFarmsWithFields } from "@/lib/database"
import DashboardNav from "@/components/dashboard-nav"
import FarmCard from "@/components/farm-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function FieldsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const farms = await getFarmsWithFields(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        user={{
          email: session.user.email || "",
          full_name: session.user.name,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Champs & Fermes</h1>
            <p className="text-gray-600">Gérez vos propriétés agricoles et vos champs</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/fields/add-field">
              <Button variant="outline" className="bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un champ
              </Button>
            </Link>
            <Link href="/dashboard/fields/add-farm">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une ferme
              </Button>
            </Link>
          </div>
        </div>

        {farms.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune ferme pour l’instant</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter votre première ferme et vos champs</p>
            <Link href="/dashboard/fields/add-farm">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre première ferme
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
