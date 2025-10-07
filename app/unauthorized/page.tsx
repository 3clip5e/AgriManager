// app/unauthorized/page.tsx (Page Simple pour Accès Refusé)
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Non Autorisé</h1>
        <p className="text-gray-600 mb-6">Vous n'avez pas les permissions pour accéder à cette section.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/marketplace">Retour Marketplace</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Se Déconnecter</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
