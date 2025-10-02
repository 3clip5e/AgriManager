import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard-nav";
import ProfileForm from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <DashboardNav
        user={{
          email: session.user.email || "",
          full_name: session.user.name || "",
        }}
      /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">
            Modifiez vos informations personnelles et votre photo de profil
          </p>
        </div>

        <ProfileForm />
      </main>
    </div>
  );
}
