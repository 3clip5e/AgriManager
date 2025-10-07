// components/admin/UserTable.tsx (Table Users - Fetch API + Actions)
"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { User, Edit, Trash2, Eye } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'farmer' | 'admin';
  farm_name?: string;
  city?: string;
  created_at: string;
}

export default function UserTable() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (p = page, s = search) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p.toString(), search: s });
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      const { users: data, totalPages: tp } = await res.json();
      setUsers(data);
      setTotalPages(tp);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user.role === 'admin') fetchUsers();
  }, [session]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchUsers(1, e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet utilisateur ? (Supprime aussi profil/produits)')) {
      await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchUsers(page, search);
    }
  };

  const handleEdit = (user: User) => {
    // Trigger modal edit (global)
    const modal = document.getElementById('edit-user-modal') as HTMLDialogElement;
    // Set data via custom event ou state global (simplifié : utilisez props ou context)
    (window as any).currentEditUser  = user;  // Temp ; mieux avec state manager
    modal?.showModal();
  };

  if (loading) return <div className="text-center py-4">Chargement des utilisateurs...</div>;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex justify-between">
        <Input
          placeholder="Rechercher par email ou nom..."
          value={search}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Ferme / Ville</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'farmer' ? 'secondary' : 'default'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.farm_name || '-'} / {user.city || '-'}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Éditer
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Simple */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>
            Précédent
          </Button>
          <span>Page {page} / {totalPages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>
            Suivant
          </Button>
        </div>
      )}

      {users.length === 0 && <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>}
    </div>
  );
}
