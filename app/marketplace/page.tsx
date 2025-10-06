     // app/marketplace/page.tsx (version Next.js 15+ : Server component async, pas "use client")
     import { db } from "@/lib/database";  // mysql2
     import { Search, Filter, X } from "lucide-react";  // Icons (Shadcn)
     import { Input } from "@/components/ui/input";
      import MarketplaceNav from "@/components/MarketplaceNav";
     import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
     import { Button } from "@/components/ui/button";
     import Link from "next/link";  // Pour navigation server-side (filtres sans "use client")

     // Types pour searchParams (string | string[] | undefined) – Avant fonction
     interface MarketplaceParams {
       search?: string;
       category?: string;
       page?: string;
     }

     // Page async server component (await searchParams pour Next.js 15+)
     export default async function MarketplacePage({
       searchParams,
     }: {
       searchParams: Promise<MarketplaceParams>;
     }) {
       // Await searchParams (fix erreurs sync propriétés)
       const params = await searchParams;
       const search = params.search || "";
       const category = params.category || "all";
       const rawPage = parseInt(params.page || "1", 10);

       const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage);

       // SQL base pour produits (ajustez colonnes : id, name, category, price, image_url, farmer_id)
       // Dans MarketplacePage (extrait query + JSX grid – gardez reste identique)
     // SQL amélioré (JOIN user_profiles pour farm_name/city ; assume colonnes ajoutées)
         // SQL amélioré (JOIN user_profiles pour farm_name/city ; COALESCE safe pour TINYINT organic=0)
            // SQL base (sans LIMIT/OFFSET)
       let sql = `
         SELECT 
           p.id, p.name, COALESCE(p.description, '') as description, p.category, 
           COALESCE(p.price_per_unit, p.price, 0) as price_per_unit,
           COALESCE(p.unit, 'kg') as unit,
           COALESCE(p.quantity_available, 10) as quantity_available,
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
         WHERE COALESCE(p.status, 'available') = 'available'
       `;
       const sqlParams: any[] = [];  // Seulement strings (category/search)

       // Filtres (seuls ? pushés)
       if (category && category !== "all") {
         sql += " AND p.category = ?";
         sqlParams.push(category);  // String pour ENUM
       }
       if (search) {
         sql += " AND p.name LIKE ?";
         sqlParams.push(`%${search}%`);
       }

       // Pagination : Concaténez (safe server-side ; évite ? int strict)
       const limit = 12;
       const offset = (page - 1) * limit;
       sql += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;  // ← FIX : Pas de ? (int to string)

       // Exécution main
       let products: any[] = [];
       let total = 0;
       try {
         // Debug (retirez après)
         console.log('SQL Main:', sql);
         console.log('Params Main:', sqlParams.map(p => typeof p + ':' + p));  // Seulement strings ; pas LIMIT

         const [prodRows] = await db.execute(sql, sqlParams);  // Params vides ou strings → Pas d'erreur arguments
         products = prodRows as any[];

         // Count séparé (sans LIMIT ; filtres seulement)
         let countSql = `
           SELECT COUNT(*) as total
           FROM products p
           JOIN users u ON p.farmer_id = u.id
           LEFT JOIN user_profiles up ON u.id = up.user_id
           WHERE COALESCE(p.status, 'available') = 'available'
         `;
         const countParams: any[] = [];
         if (category && category !== "all") {
           countSql += " AND p.category = ?";
           countParams.push(category);
         }
         if (search) {
           countSql += " AND p.name LIKE ?";
           countParams.push(`%${search}%`);
         }

         // Debug count
         console.log('SQL Count:', countSql);
         console.log('Params Count:', countParams.map(p => typeof p + ':' + p));  // Strings ou []

         const [countRows] = await db.execute(countSql, countParams);
         total = Number((countRows as any[])[0]?.total || 0);

         // Debug résultats
         console.log('Products loaded:', products.length, 'Total:', total);
       } catch (error) {
         console.error("❌ Marketplace DB Error:", error.message || error);
         products = [];
         total = 0;
       }

       const totalPages = Math.ceil(total / limit);  // Après try-catch (fix ReferenceError)
       
     

       // Exécute query server-side
      //  let products = [];
      //  let total = 0;
      //  try {
      //    const [prodRows] = await db.execute(sql, sqlParams);
      //    products = prodRows as any[];

      //    // Total pour pagination (query sans LIMIT)
      //    const countSql = sql.split(" ORDER BY")[0];  // Enlève ORDER/LIMIT
      //    const [countRows] = await db.execute(
      //      countSql.replace(
      //        "SELECT p.id, p.name, p.category, p.price, p.image_url, u.name as farmer_name, u.email as farmer_email",
      //        "SELECT COUNT(*) as total"
      //      ),
      //      sqlParams.slice(0, -2)
      //    );
      //    total = (countRows as any[])[0].total;
      //  } catch (error) {
      //    console.error("❌ Marketplace DB Error:", error);
      //    products = [];  // Fallback vide
      //  }
      //  const totalPages = Math.ceil(total / limit);

       return (
         <div className="min-h-screen bg-green-50 py-8">
          {/* <div className="md:hidden">
    <DropdownMenu> Hamburger trigger ... </DropdownMenu>
  </div> */}
  
          <MarketplaceNav />
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-8">
             <div className="mb-8">
               <h1 className="text-3xl font-bold text-green-800">Marketplace Agricole</h1>
               <p className="text-gray-600 mt-2">Découvrez des produits frais de nos fermiers</p>
             </div>

             {/* Filtres/Search Form (server-rendered : Utilise action="/marketplace" + Link pour submit) */}
             <form action="/marketplace" className="mb-6 bg-white p-4 rounded-lg shadow-md">  {/* Server action pour submit */}
               <div className="flex flex-col md:flex-row gap-4">
                 {/* Search Input (defaultValue résolu – fix ligne 88) */}
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                   <Input
                     placeholder="Rechercher des produits..."
                     className="pl-10"
                     defaultValue={search}  // String résolu
                     name="search"
                     type="search"
                   />
                 </div>

                 {/* Category Select (defaultValue résolu – fix ligne 94) */}
                 <div className="flex gap-4 items-end">  {/* Align pour button */}
                   <Select name="category" defaultValue={category}>  {/* Résolu */}
                     <SelectTrigger className="w-48">
                       <SelectValue placeholder="Toutes Catégories" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">Toutes</SelectItem>
                       <SelectItem value="fruits">Fruits</SelectItem>
                       <SelectItem value="legumes">Légumes</SelectItem>
                       <SelectItem value="cereales">Céréales</SelectItem>
                       {/* Ajoutez catégories de DB */}
                     </SelectContent>
                   </Select>

                   {/* Submit + Clear (server-side via Link/Button) */}
                   <Button type="submit" className="bg-green-600 hover:bg-green-700">
                     <Filter className="h-4 w-4 mr-2" /> Filtrer
                   </Button>
                   {(search || category !== "all") && (
                     <Button variant="outline" asChild>
                       <Link href="/marketplace">  {/* Reset query */}
                         <X className="h-4 w-4 mr-2" /> Effacer
                       </Link>
                     </Button>
                   )}
                 </div>
               </div>
             </form>

             {/* Products Grid */}
             {products.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {products.map((row: any) => (
                   <ProductCard
                     key={row.id}
                     product={{
                       id: row.id,
                       name: row.name,
                       description: row.description,
                       category: row.category,
                       price_per_unit: row.price_per_unit || row.price || 0,
                       unit: row.unit || 'kg',
                       quantity_available: row.quantity_available || 0,
                       harvest_date: row.harvest_date,
                       expiry_date: row.expiry_date,
                       organic_certified: !!row.organic_certified,  // 1 → true pour UI
                       status: row.status || 'available',
                       image_url: row.image_url,
                       profiles: {
                         full_name: row.full_name,
                         farm_name: row.farm_name,
                         city: row.city,
                       },
                     }}
                   />
                 ))}
               </div>
             ) : (
               <div className="text-center py-12 bg-white rounded-lg shadow-md">
                 <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                 <p className="text-gray-500 text-lg">Aucun produit trouvé.</p>
                 <p className="text-gray-400 mt-2">Essayez d'ajuster vos filtres ou ajoutez des produits.</p>
               </div>
             )}

             {/* Pagination (Links server-side) */}
             {totalPages > 1 && (
               <div className="flex justify-center mt-8 space-x-2">
                 <Button variant="outline" asChild>
                   <Link href={`/marketplace?search=${encodeURIComponent(search)}&category=${category}&page=${Math.max(1, page - 1)}`}>
                     Précédent
                   </Link>
                 </Button>
                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                   const p = Math.max(1, page - 2 + i);  // 5 pages autour de current
                   if (p <= totalPages) return (
                     <Button
                       key={p}
                       variant={p === page ? "default" : "outline"}
                       asChild
                     >
                       <Link href={`/marketplace?search=${encodeURIComponent(search)}&category=${category}&page=${p}`}>
                         {p}
                       </Link>
                     </Button>
                   );
                 })}
                 <Button variant="outline" asChild>
                   <Link href={`/marketplace?search=${encodeURIComponent(search)}&category=${category}&page=${Math.min(totalPages, page + 1)}`}>
                     Suivant
                   </Link>
                 </Button>
               </div>
             )}
           </div>
         </div>
       );
     }
     