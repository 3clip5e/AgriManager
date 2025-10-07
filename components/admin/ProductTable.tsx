// components/admin/ProductTable.tsx (Table Produits - Modération)
"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { Package, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  category: string;
  price_per_unit: number;
  status: 'available' | 'sold_out' | 'pending' | 'rejected';
  farmer_name: string;
  image_url?: string;
  created_at: string;
}

export default function ProductTable() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (p = page, s = search) => {
    setLoading(true);
    const params = new URLSearchParams({ page: p.toString(), search: s });
    const res = await fetch(`/api/admin/products?${params}`);
    if (res.ok) {
      const { products: data, totalPages: tp } = await res.json();
      setProducts(data);
      setTotalPages(tp);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user.role === 'admin') fetchProducts();
  }, [session]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchProducts(1, e.target.value);
  };

  const handleApprove = async (id: string) => {
    if (confirm('Approuver ce produit ?')) {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'available' }),
      });
      fetchProducts(page, search);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Rejeter ce produit ?')) {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' }),
      });
      fetchProducts(page, search);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce produit ?')) {
      await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchProducts(page, search);
    }
  };

  const handleEdit = (product: Product) => {
    const modal = document.getElementById('edit-product-modal') as HTMLDialogElement;
    (window as any).currentEditProduct = product;
    modal?.showModal();
  };

  if (loading) return <div className="text-center py-4">Chargement des produits...</div>;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher par nom..."
        value={search}
        onChange={handleSearch}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix / Unité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Vendeur</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} width={50} height={50} className="rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">No Image</div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>€{product.price_per_unit.toFixed(2)}</TableCell>
              <TableCell>
                // components/admin/ProductTable.tsx (Suite - À partir de la ligne Badge)
                <Badge variant={product.status === 'available' ? 'default' : product.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>{product.farmer_name}</TableCell>
              <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="space-x-2">
                {product.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleApprove(product.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleReject(product.id)}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Éditer
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination (identique à UserTable) */}
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

      {products.length === 0 && <p className="text-center text-gray-500">Aucun produit trouvé.</p>}
    </div>
  );
}
