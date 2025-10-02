import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
// import { db, query } from "@/lib/database"
import { db, query } from "@/lib/mysql"
import DashboardNav from "@/components/dashboard-nav"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
import Link from "next/link"

export default async function DashboardMarketplacePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const products = await query("SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC", [
    session.user.id,
  ]);
  // const products = productRows as any[]

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
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600">Manage your product listings and sales</p>
          </div>
          <Link href="/dashboard/marketplace/add-product">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products listed yet</h3>
            <p className="text-gray-600 mb-6">Start selling your fresh produce to customers</p>
            <Link href="/dashboard/marketplace/add-product">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                List Your First Product
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
