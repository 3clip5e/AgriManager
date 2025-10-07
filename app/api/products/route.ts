// app/api/products/route.ts (Version Sans Zod : Fix ReferenceError + Fonctionnalités)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";  // App Router standard
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { v4 as uuidv4 } from "uuid";  // Pour id PRIMARY KEY

export async function POST(req: NextRequest) {
  try {
    // Session + Check Rôle Farmer
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "farmer") {
      return NextResponse.json(
        { error: "Accès farmer requis et authentifié" },
        { status: 403 }
      );
    }
    const farmer_id = session.user.id;

    const body = await req.json();
    
    // Validation Manuelle (étendue ; remplace Zod)
    const { name, description, category, price_per_unit, unit, quantity_available, harvest_date, expiry_date, organic_certified, image_url } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }
    if (!category || !["fruits", "legumes", "cereales", "autres"].includes(category)) {
      return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 });
    }
    const price = parseFloat(price_per_unit);
    if (!price_per_unit || price <= 0) {
      return NextResponse.json({ error: "Prix par unité > 0 requis" }, { status: 400 });
    }
    if (!unit?.trim()) {
      return NextResponse.json({ error: "Unité requise (ex. : kg)" }, { status: 400 });
    }
    const quantity = parseInt(quantity_available);
    if (quantity_available == null || quantity < 0) {
      return NextResponse.json({ error: "Quantité disponible >= 0 requise" }, { status: 400 });
    }
    if (harvest_date && isNaN(Date.parse(harvest_date))) {
      return NextResponse.json({ error: "Date de récolte invalide (YYYY-MM-DD)" }, { status: 400 });
    }
    if (expiry_date && isNaN(Date.parse(expiry_date))) {
      return NextResponse.json({ error: "Date d'expiration invalide" }, { status: 400 });
    }

    // Génération UUID pour id (PRIMARY KEY)
    const product_id = uuidv4();

    // SQL avec id en 1er (15 colonnes)
    await db.execute(
      `INSERT INTO products 
       (id, farmer_id, name, description, category, price_per_unit, unit, quantity_available,
        harvest_date, expiry_date, organic_certified, image_url, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', NOW(), NOW())`,
      [
        product_id,  // UUID en 1er
        farmer_id,
        name.trim(),
        description?.trim() || null,
        category,
        price,  // parseFloat
        unit.trim() || "kg",
        quantity,  // parseInt
        harvest_date || null,
        expiry_date || null,
        organic_certified ? 1 : 0,  // TINYINT 0/1
        image_url || null,
      ]
    );

    // Response Succès avec détails
    return NextResponse.json({
      message: "Produit créé avec succès",
      product_id,
      product: {
        id: product_id,
        farmer_id,
        name: name.trim(),
        description: description?.trim() || null,
        category,
        price_per_unit: price,
        unit: unit.trim() || "kg",
        quantity_available: quantity,
        harvest_date: harvest_date || null,
        expiry_date: expiry_date || null,
        organic_certified: !!organic_certified,
        image_url: image_url || null,
        status: "available",
        created_at: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error("❌ Error creating product:", error);

    // Gestion Erreurs Spécifiques (MySQL)
    if (error.code === "ER_DUP_ENTRY") {
      if (error.sqlMessage.includes("PRIMARY")) {
        return NextResponse.json(
          { error: "ID produit dupliqué (réessayez)" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Produit avec ce nom existe déjà pour ce fermier" },
        { status: 409 }
      );
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        { error: "Fermier non trouvé (ID invalide)" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur lors de la création du produit" },
      { status: 500 }
    );
  }
}
