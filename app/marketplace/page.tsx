// import { query, db } from "@/lib/database"
import { db, query } from "@/lib/mysql"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sprout, Search, Filter } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  category?: string
  search?: string
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Build query
  let sql = `
    SELECT p.*, u.name as seller_name, u.email as seller_email
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.status = 'available' AND p.quantity_available > 0
  `
  const params: any[] = []

  // Apply filters
  if (searchParams.category) {
    sql += " AND p.category = ?"
    params.push(searchParams.category)
  }

  if (searchParams.search) {
    sql += " AND p.name LIKE ?"
    params.push(`%${searchParams.search}%`)
  }

  sql += " ORDER BY p.created_at DESC"

  const products = await query(sql, params) as any[]
  // const products = productRows as any[]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-green-800">AgriManager Marketplace</h1>
            </Link>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Sell Your Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Fresh from Farm to Table</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover fresh, locally grown produce directly from farmers. Support sustainable agriculture and enjoy the
            best quality products.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  defaultValue={searchParams.search}
                  name="search"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select defaultValue={searchParams.category || "all"}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="cereals">Cereals</SelectItem>
                  <SelectItem value="legumes">Legumes</SelectItem>
                  <SelectItem value="herbs">Herbs</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-green-600 hover:bg-green-700">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Sprout className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or browse all categories</p>
            <Link href="/marketplace">
              <Button className="bg-green-600 hover:bg-green-700">Browse All Products</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  ) 
}
