// app/dashboard/admin/page.tsx (Dashboard Admin - Tabs Users/Products)
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Package, UserPlus, ShoppingBag } from 'lucide-react';
import UserTable from '@/components/admin/UserTable';
import ProductTable from '@/components/admin/ProductTable';
import Link from 'next/link';
import UserCreateModal from '@/components/admin/UserCreateModal';
import UserEditModal from '@/components/admin/UserEditModal';
import ProductEditModal from '@/components/admin/ProductEditModal';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0 });
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (session?.user.role !== 'admin') {
      window.location.href = '/unauthorized';  // Fallback client-side
      return;
    }
    // Fetch stats (optionnel ; via API)
    fetch('/api/admin/stats')  // Créez cette API si besoin (count users/products)
      .then(res => res.json())
      .then(setStats)
      .catch(() => setStats({ totalUsers: 0, totalProducts: 0 }));
  }, [session]);

  if (!session || session.user.role !== 'admin') {
    return <div>Chargement...</div>;  // Ou redirect
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Dashboard Administrateur</h1>
              <p className="text-gray-600 mt-2">Gérez les utilisateurs et produits de la plateforme</p>
            </div>
            <Badge variant="secondary" className="text-lg">
              Rôle: {session.user.role.toUpperCase()}
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits Actifs</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>
            {/* Ajoutez plus : Commandes, Logs, etc. */}
          </div>
        </div>

        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle>Gestion</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">
                  <Users className="mr-2 h-4 w-4" />
                  Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="products">
                  <Package className="mr-2 h-4 w-4" />
                  Produits
                </TabsTrigger>
              </TabsList>
              <TabsContent value="users" className="mt-4">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
                  <Button onClick={() => document.getElementById('create-user-modal')?.showModal()}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter Utilisateur
                  </Button>
                </div>
                <UserTable />
              </TabsContent>
              <TabsContent value="products" className="mt-4">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Gestion des Produits</h2>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/marketplace/add-product">Nouveau Produit (Farmer)</Link>
                  </Button>
                </div>
                <ProductTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modals Globaux : Réutilisables par tables */}
      <UserCreateModal />
      <UserEditModal />
      <ProductEditModal />
    </div>
  );
}
