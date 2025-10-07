// app/marketplace/page.tsx (Version Finale - Avec Parsing Numérique pour Fix TypeError)
import { db } from "@/lib/database";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import MarketplaceNav from "@/components/MarketplaceNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import Link from "next/link";

// Interface Product (inchangée, mais runtime number garanti)
interface Product {
  id: string;
  name: string;
  description: string;
  category: 'fruits' | 'legumes' | 'cereales' | 'autres';
  price_per_unit: number;  // Garanti number après parsing
  unit: string;
  quantity_available: number;
  harvest_date?: string;
  expiry_date?: string;
  organic_certified: boolean;
  status: 'available' | 'sold_out';
  image_url: string;
  full_name?: string;
  farm_name?: string;
  city?: string;
}

interface MarketplaceParams {
  search?: string;
  category?: string;
  page?: string;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<MarketplaceParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "all";
  const rawPage = parseInt(params.page || "1", 10);
  const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);

  // SQL base (inchangée : farmer_id, COALESCE price)
  let sql = `
    SELECT 
      p.id, p.name, COALESCE(p.description, '') as description, p.category, 
      COALESCE(p.price_per_unit, p.price, 0.00) as price_per_unit,
      COALESCE(p.unit, 'kg') as unit,
      COALESCE(p.quantity_available, 0) as quantity_available,
      p.harvest_date, p.expiry_date, 
      COALESCE(p.organic_certified, 0) as organic_certified,
      COALESCE(p.status, 'available') as status,
      COALESCE(p.image_url, '') as image_url,
      u.name as full_name,
      COALESCE(up.farm_name, u.name) as farm_name,
      COALESCE(up.city, '') as city
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE p.status = 'available' AND p.quantity_available > 0
  `;
  const sqlParams: string[] = [];

  if (category && category !== "all") {
    sql += " AND p.category = ?";
    sqlParams.push(category);
  }
  if (search) {
    sql += " AND p.name LIKE ?";
    sqlParams.push(`%${search}%`);
  }

  const limit = 12;
  const offset = (page - 1) * limit;
  sql += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  // Exécution
  let products: Product[] = [];
  let total = 0;
  try {
    const [prodRows] = await db.execute(sql, sqlParams);
    
    // ← FIX : Parsing numérique (string MySQL → number JS)
    products = (prodRows as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      price_per_unit: Number(row.price_per_unit) || 0,  // String "2.50" → 2.5
      unit: row.unit,
      quantity_available: Number(row.quantity_available) || 0,  // INT string → number
      harvest_date: row.harvest_date,
      expiry_date: row.expiry_date,
      organic_certified: !!Number(row.organic_certified),  // TINYINT 0/1 → bool
      status: row.status,
      image_url: row.image_url,
      full_name: row.full_name,
      farm_name: row.farm_name,
      city: row.city,
    }));

    // Count (inchangé, mais parsing non nécessaire pour COUNT)
    let countSql = sql.split(` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`)[0];
    countSql = countSql.replace(
      `SELECT p.id, p.name, COALESCE(p.description, '') as description, p.category, 
       COALESCE(p.price_per_unit, p.price, 0.00) as price_per_unit, COALESCE(p.unit, 'kg') as unit,
       COALESCE(p.quantity_available, 0) as quantity_available, p.harvest_date, p.expiry_date, 
       COALESCE(p.organic_certified, 0) as organic_certified, COALESCE(p.status, 'available') as status,
       COALESCE(p.image_url, '') as image_url, u.name as full_name,
       COALESCE(up.farm_name, u.name) as farm_name, COALESCE(up.city, '') as city`,
      "SELECT COUNT(*) as total"
    );
    const [countRows] = await db.execute(countSql, sqlParams);
    total = Number((countRows as any[])[0]?.total || 0);

    console.log(`✅ Marketplace: ${products.length} produits sur ${total} (page ${page})`);
  } catch (error: any) {
    console.error("❌ Marketplace DB Error:", error.message || error);
    console.error("SQL échouée:", sql);

    // Fallback avec parsing
    const fallbackSql = `
      SELECT 
        id, name, COALESCE(description, '') as description, category, 
        COALESCE(price_per_unit, price, 0.00) as price_per_unit, COALESCE(unit, 'kg') as unit,
        COALESCE(quantity_available, 0) as quantity_available, harvest_date, expiry_date,
        COALESCE(organic_certified, 0) as organic_certified, COALESCE(status, 'available') as status,
        COALESCE(image_url, '') as image_url, 'Anonyme' as full_name, NULL as farm_name, NULL as city
      FROM products 
      WHERE status = 'available' AND quantity_available > 0
    `;
    const fallbackParams: string[] = [];
    if (category && category !== "all") {
      fallbackSql += " AND category = ?";
      fallbackParams.push(category);
    }
    if (search) {
      fallbackSql += " AND name LIKE ?";
      fallbackParams.push(`%${search}%`);
    }
    fallbackSql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    try {
      const [fallbackRows] = await db.execute(fallbackSql, fallbackParams);
      products = (fallbackRows as any[]).map((row) => ({  // ← FIX : Parsing dans fallback aussi
        id: row.id,
        name: row.name,
        description: row.description,
        category: row.category,
        price_per_unit: Number(row.price_per_unit) || 0,
        unit: row.unit,
        quantity_available: Number(row.quantity_available) || 0,
        harvest_date: row.harvest_date,
        expiry_date: row.expiry_date,
        organic_certified: !!Number(row.organic_certified),
        status: row.status,
        image_url: row.image_url,
        full_name: row.full_name,
        farm_name: row.farm_name,
        city: row.city,
      }));
      const fbCountSql = fallbackSql.replace(` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, "").replace(
        "SELECT id, name, ...", "SELECT COUNT(*) as total"
      );
      const [fbCountRows] = await db.execute(fbCountSql, fallbackParams);
      total = Number((fbCountRows as any[])[0]?.total || 0);
      console.log("🔄 Fallback activé: Produits sans JOIN");
    } catch (fbError) {
      console.error("❌ Fallback échoué:", fbError);
      products = [];
      total = 0;
    }
  }

  const totalPages = Math.ceil(total / limit);

  // Rendu JSX (inchangé)
  return (
    <div className="min-h-screen bg-green-50 py-8">
      <MarketplaceNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Marketplace Agricole</h1>
          <p className="text-gray-600 mt-2">Découvrez des produits frais de nos fermiers</p>
        </div>

        <form action="/marketplace" className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des produits..."
                className="pl-10"
                defaultValue={search}
                name="search"
                type="search"
              />
            </div>
            <div className="flex gap-4 items-end">
              <Select name="category" defaultValue={category}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Toutes Catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="legumes">Légumes</SelectItem>
                  <SelectItem value="cereales">Céréales</SelectItem>
                  <SelectItem value="autres">Autres</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              {(search || category !== "all") && (
                <Button variant="outline" asChild>
                  <Link href="/marketplace">
                    <X className="h-4 w-4 mr-2" />
                    Effacer
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </form>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Aucun produit trouvé.</p>
            <p className="text-gray-400 mt-2">
              {search || category !== "all"
                ? "Essayez d'ajuster vos filtres."
                : "Aucun produit disponible. Ajoutez-en via le dashboard farmer."}
            </p>
            {total === 0 && <p className="text-red-500 mt-2 text-sm">Vérifiez les logs serveur pour erreurs DB.</p>}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <Button variant="outline" asChild disabled={page === 1}>
              <Link
                href={`/marketplace?search=${encodeURIComponent(search)}&category=${category}&page=${Math.max(1, page - 1)}`}
              >
                Précédent
              </Link>
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page - 2 + i;
              if (p >= 1 && p <= totalPages) {
                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    asChild
                  >
                    <Link
                      href={`/marketplace?search=${encodeURIComponent(search)}&category=${category}&page=${p}`}
                    >
                      {p}
                    </Link>
                  </Button>
                );
              }
            })}
            <Button variant="outline" asChild disabled={page === totalPages}>
              <Link
                href={`/marketplace?search=${encodeURIComponent(search)}&category=${category}&page=${Math.min(totalPages, page + 1)}`}
              >
                Suivant
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
