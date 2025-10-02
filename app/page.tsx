import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Users, TrendingUp, Shield, Smartphone, Cloud } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* En-tête */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-green-800">AgriManager</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Commencer</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Section Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Révolutionnez la gestion de votre ferme</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Exploitez la puissance de l'IA et de la technologie moderne pour optimiser vos opérations agricoles, augmenter vos rendements et connecter directement avec les acheteurs.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Commencer l'essai gratuit
              </Button>
            </Link>
            <Link href="/dashboard/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 bg-transparent"
              >
                Parcourir le marché
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin pour réussir</h3>
            <p className="text-lg text-gray-600">Des outils complets pour la gestion agricole moderne</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 p-3 rounded-full w-fit">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Gestion intelligente des champs</CardTitle>
                <CardDescription>
                  Suivez vos cultures, surveillez la santé du sol et optimisez les calendriers de plantation grâce à des analyses IA.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 p-3 rounded-full w-fit">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Analyses pilotées par l'IA</CardTitle>
                <CardDescription>
                  Recevez des recommandations personnalisées pour l'irrigation, la fertilisation et la lutte contre les parasites.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 p-3 rounded-full w-fit">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Marché direct</CardTitle>
                <CardDescription>
                  Vendez vos produits directement aux acheteurs, éliminant les intermédiaires et maximisant vos profits.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-full w-fit">
                  <Cloud className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-800">Intégration météo</CardTitle>
                <CardDescription>
                  Données météorologiques en temps réel et prévisions pour prendre des décisions éclairées.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-red-100 p-3 rounded-full w-fit">
                  <Smartphone className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-800">Accès mobile</CardTitle>
                <CardDescription>Accédez à vos données agricoles partout grâce à notre application web responsive.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-full w-fit">
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-gray-800">Sécurisé & fiable</CardTitle>
                <CardDescription>
                  Vos données sont protégées avec une sécurité de niveau entreprise et des sauvegardes régulières.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Appel à l'action */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Prêt à transformer votre ferme ?</h3>
          <p className="text-xl text-green-100 mb-8">
            Rejoignez des milliers d’agriculteurs qui utilisent déjà AgriManager pour augmenter leur productivité.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
              Commencez votre essai gratuit dès aujourd’hui
            </Button>
          </Link>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Sprout className="h-6 w-6 text-green-400 mr-2" />
            <span className="text-lg font-semibold">AgriManager</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            Accompagner les agriculteurs avec des solutions de gestion agricole intelligentes.
          </p>
        </div>
      </footer>
    </div>
  )
}
