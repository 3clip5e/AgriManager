// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db, query } from "@/lib/database"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      name,
      price_per_unit,
      unit,
      quantity_available,
      category,
      description,
      organic_certified,
    } = body

    if (!name || !price_per_unit || !unit || quantity_available == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await db.execute(
      `INSERT INTO products 
       (user_id, name, price_per_unit, unit, quantity_available, category, description, organic_certified, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available', NOW(), NOW())`,
      [
        session.user.id,
        name,
        price_per_unit,
        unit,
        quantity_available,
        category || null,
        description || null,
        organic_certified ? 1 : 0,
      ]
    )

    return NextResponse.json({ message: "Product created successfully" })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
