// app/auth/login/page.tsx
// Correction : Try-catch sur getServerSession pour éviter crash JWT.

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
    console.log("Session dans login page:", session ? "Existe" : "Aucune");  // Debug temporaire
  } catch (error) {
    console.error("❌ Erreur session dans login page:", error);
    // Continue sans session (affiche formulaire)
  }

  // Si session valide, redirige basé sur rôle
  if (session?.user?.id) {
    const role = session.user.role || "buyer";
    if (role === "buyer") return redirect("/marketplace");
    if (role === "farmer") return redirect("/dashboard");
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
