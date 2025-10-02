import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
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
  }

  await supabase
    .from('user_profiles')
    .update({
      full_name: full_name || null,
      phone: phone || null,
      address: address || null
    })
    .eq('id', session.user.id);

  await supabase
    .from('users')
    .update({
      name: full_name || null
    })
    .eq('id', session.user.id);

  return NextResponse.json({ message: "Profile updated successfully", imageUrl });
}
