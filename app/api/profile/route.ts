import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const users = await query(
    `SELECT u.id, u.name AS full_name, u.email, p.phone, p.address, u.image AS image
     FROM users u
     LEFT JOIN user_profiles p ON u.id = p.id
     WHERE u.id = ?`,
    [session.user.id]
  );

  if (!users || users.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(users[0]);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { full_name, phone, address, imageBase64 } = body;

  let imageUrl = null;

  // Upload sur Cloudinary si une image est fournie
  if (imageBase64) {
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "user_profiles",
      transformation: [{ width: 300, height: 300, crop: "thumb", gravity: "face" }],
    });
    imageUrl = uploadResponse.secure_url;
  } else {
      // Récupérer l'ancienne image depuis la base
      const result = await query(
      `SELECT image_url FROM user_profiles WHERE id = ?`,
      [session.user.id]
      );
      imageUrl = result[0]?.image_url || null;
}

  await query(
    `UPDATE user_profiles
     SET full_name = ?, phone = ?, address = ?, image_url = ?, updated_at = NOW()
     WHERE id = ?`,
    [full_name || null, phone || null, address || null, imageUrl, session.user.id]
  );

  await query(
    `UPDATE users
     SET name = ?, image = ?
     WHERE id = ?`,
    [full_name || null, imageUrl, session.user.id]
  );

  return NextResponse.json({ message: "Profile updated successfully", imageUrl });
}
