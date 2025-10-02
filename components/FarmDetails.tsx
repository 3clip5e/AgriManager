// components/FarmDetails.tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, Droplets, Leaf, Eye } from "lucide-react";

export default function FarmDetails({ farm }: { farm: Farm }) {
  const totalParcels = farm.parcels.length;
  const activePlantings = farm.parcels.reduce(
    (acc: number, parcel: any) => acc + parcel.plantings.filter((p: any) => p.status === "planted" || p.status === "growing").length,
    0
  );

  const utilizedArea = farm.parcels.reduce(
    (acc: number, parcel: any) =>
      acc +
      parcel.plantings.reduce((sum: number, p: any) => (p.status === "planted" || p.status === "growing" ? sum + parcel.area : sum), 0),
    0
  );

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">{farm.name}</CardTitle>
          {farm.organic_certified && (
            <Badge className="bg-green-100 text-green-800 flex items-center">
              <Leaf className="h-4 w-4 mr-1" />
              Biologique
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{farm.description}</p>
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <Ruler className="h-4 w-4 inline mr-1" /> {farm.total_area} ha
            </div>
            <div>Parcelles : {totalParcels}</div>
            <div>Cultures actives : {activePlantings}</div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Parcelles</h4>
            <div className="space-y-2 mt-2">
              {farm.parcels.map((parcel: any) => (
                <Card key={parcel.id} className="p-2 border border-gray-200">
                  <div className="flex justify-between">
                    <div>{parcel.name} ({parcel.area} ha)</div>
                    {parcel.plantings.length > 0 && (
                      <div className="flex gap-2">
                        {parcel.plantings.map((p: any) => (
                          <Badge key={p.id} variant="outline">
                            {p.crop_name} ({p.status})
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs mt-1">
                    {parcel.soil_type && <Badge variant="outline">Sol: {parcel.soil_type}</Badge>}
                    {parcel.irrigation_type && <Badge variant="outline">Irrigation: {parcel.irrigation_type}</Badge>}
                    {parcel.soil_ph && <Badge variant="outline">pH: {parcel.soil_ph}</Badge>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
