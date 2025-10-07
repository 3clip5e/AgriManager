// app/api/admin/stats/route.ts (GET Stats - Admin Only)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { getSession } from '@/lib/auth';  // Assume votre fonction session (NextAuth)

async function requireAdmin(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    // Stats users (totaux par rôle)
    const [userRows] = await db.execute(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN role = 'buyer' THEN 1 ELSE 0 END) as totalBuyers,
        SUM(CASE WHEN role = 'farmer' THEN 1 ELSE 0 END) as totalFarmers,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as totalAdmins
      FROM users
    `);
    const userStats = userRows[0] as any;

    // Stats produits (actifs, par catégorie)
    const [productRows] = await db.execute(`
      SELECT 
        COUNT(*) as totalProducts,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as activeProducts
      FROM products
      WHERE status = 'available' AND quantity_available > 0
    `);
    const productStats = productRows[0] as any;

    return NextResponse.json({
      totalUsers: userStats.totalUsers,
      totalBuyers: userStats.totalBuyers,
      totalFarmers: userStats.totalFarmers,
      totalAdmins: userStats.totalAdmins,
      totalProducts: productStats.totalProducts,
      activeProducts: productStats.activeProducts,
    });
  } catch (error) {
    console.error('❌ Stats Error:', error);
    return NextResponse.json({ error: 'Erreur récupération stats' }, { status: 500 });
  }
}
