import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { query } from "@/lib/database";
import DashboardNav from "@/components/dashboard-nav";
import FarmDetails from "@/components/FarmDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Planting {
  id: string;
  crop_name: string;
  status: string;
  quantity_planted?: number;
  quantity_harvested?: number;
}

interface Parcel {
  id: string;
  name: string;
  area: number;
  soil_type?: string;
  soil_ph?: number;
  irrigation_type?: string;
  plantings: Planting[];
}

interface Farm {
  id: string;
  name: string;
  location: string;
  total_area: number;
  description?: string;
  organic_certified: boolean;
  parcels: Parcel[];
}

export default async function FarmPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const resolvedParams = await params;
  const { farmId } = resolvedParams;

  // 🔐 Auth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  if (!farmId) notFound();

  // 🌾 Récupérer la ferme
  const farms = await query(
    `SELECT id, name, location, total_area, description, organic_certified
     FROM farms
     WHERE id = ? AND user_id = ?`,
    [farmId, session.user.id]
  );

  if (!farms || farms.length === 0) notFound();
  const farmRow = farms[0];

  // 🧱 Récupérer les parcelles + plantations
  const fields = await query(
    `SELECT f.id AS field_id, f.name AS field_name, f.area, f.soil_type, f.soil_ph, f.irrigation_type,
            p.id AS planting_id, c.name AS crop_name, p.status, p.quantity_planted, p.quantity_harvested
     FROM fields f
     LEFT JOIN plantings p ON p.field_id = f.id
     LEFT JOIN crop_types c ON c.id = p.crop_type_id
     WHERE f.farm_id = ?`,
    [farmId]
  );

  // Regrouper les plantations par parcelle
  const parcelsMap: Record<string, Parcel> = {};
  fields.forEach((row: any) => {
    if (!parcelsMap[row.field_id]) {
      parcelsMap[row.field_id] = {
        id: row.field_id,
        name: row.field_name,
        area: row.area,
        soil_type: row.soil_type,
        soil_ph: row.soil_ph,
        irrigation_type: row.irrigation_type,
        plantings: [],
      };
    }
    if (row.planting_id) {
      parcelsMap[row.field_id].plantings.push({
        id: row.planting_id,
        crop_name: row.crop_name,
        status: row.status,
        quantity_planted: row.quantity_planted,
        quantity_harvested: row.quantity_harvested,
      });
    }
  });

  const farm: Farm = {
    id: farmRow.id,
    name: farmRow.name,
    location: farmRow.location,
    total_area: farmRow.total_area,
    description: farmRow.description,
    organic_certified: farmRow.organic_certified,
    parcels: Object.values(parcelsMap),
  };

  // 🧭 Rendu
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        user={{
          email: session.user.email || "",
          full_name: session.user.name || "",
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/dashboard/fields">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux champs
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{farm.name}</h1>
          <p className="text-gray-600">
            Détails et parcelles associées à cette ferme
          </p>
        </div>

        <FarmDetails farm={farm} />
      </main>
    </div>
  );
}
