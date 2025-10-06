// app/api/auth/register/route.ts
// Correction : db.query pour transactions (raw SQL) ; db.execute pour INSERTs (prepared).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";  // mysql2/promise pool
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";  // npm i uuid @types/uuid si manquant

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password, role = 'buyer' } = body;  // Role optionnel (défaut buyer)

    // Validation basique
    if (!email || !name || !password || password.length < 6) {
      return NextResponse.json({ error: "Données invalides (mot de passe min 6 chars)" }, { status: 400 });
    }

    // Check duplicata email (prepared, sécurisé)
    const [existingUsers] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      console.log(`❌ Email déjà utilisé: ${email}`);
      return NextResponse.json({ error: "Cet email est déjà utilisé. Connectez-vous ou utilisez un autre." }, { status: 409 });
    }

    const userId = uuidv4();  // ID unique (évite MySQL UUID() instable)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Transaction : db.query pour START/COMMIT (raw, supporte CTL)
    await db.query("START TRANSACTION");  // Raw query (pas prepared)

    try {
      // Insert user (prepared pour sécurité)
      await db.execute(
        "INSERT INTO users (id, email, name, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [userId, email, name, hashedPassword, role]
      );
      console.log(`✅ User créé: ${email} (rôle: ${role})`);

      // Insert profile (lié par id, prepared)
      await db.execute(
        "INSERT INTO user_profiles (id, full_name, email, created_at) VALUES (?, ?, ?, NOW())",
        [userId, name, email]
      );
      console.log(`✅ Profile créé pour: ${userId}`);

      await db.query("COMMIT");  // Raw pour commit
      return NextResponse.json({ message: "Inscription réussie", id: userId }, { status: 201 });

    } catch (insertError) {
      await db.query("ROLLBACK");  // Raw pour rollback
      console.error("❌ Erreur insertion (rollback):", insertError);
      throw insertError;  // Relance pour 500
    }
  } catch (error) {
    console.error("Registration error:", error);
    // Gestion ER_DUP_ENTRY résiduel
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "Email déjà utilisé ou conflit ID. Essayez un autre email." }, { status: 409 });
    }
    return NextResponse.json({ error: "Échec inscription (vérifiez DB)" }, { status: 500 });
  }
}
