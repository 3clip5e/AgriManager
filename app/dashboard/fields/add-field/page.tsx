import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db, query } from "@/lib/database"
import DashboardNav from "@/components/dashboard-nav"
import AddFieldForm from "@/components/add-field-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AddFieldPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const farms = await query("SELECT id, name FROM farms WHERE user_id = ? ORDER BY name", [session.user.id])
  // const farms = farmRows as any[]

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
          <Link href="/dashboard/fields">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fields
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Field</h1>
          <p className="text-gray-600">Create a new field within one of your farms</p>
        </div>

        <AddFieldForm farms={farms || []} />
      </main>
    </div>
  )
}
