import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Sprout, ShoppingCart, FileText } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      title: "Ajouter une ferme",
      description: "Enregistrer un nouvel emplacement de ferme",
      icon: MapPin,
      href: "/dashboard/farms/new",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Planter une culture",
      description: "Enregistrer une nouvelle activité de plantation",
      icon: Sprout,
      href: "/dashboard/plantings/new",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Lister un produit",
      description: "Ajouter un produit au marché",
      icon: ShoppingCart,
      href: "/dashboard/products/new",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Enregistrer une activité",
      description: "Consigner une activité agricole",
      icon: FileText,
      href: "/dashboard/activities/new",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-10 w-10 text-gray-600 mr-2" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center text-center space-y-2 hover:shadow-md transition-shadow bg-transparent"
                >
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
