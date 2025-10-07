// components/admin/ProductEditModal.tsx (Modal Édition Produit)
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ProductEditModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: 'fruits' as string,
    price_per_unit: 0,
    status: 'available' as 'available' | 'sold_out' | 'pending' | 'rejected',
    quantity_available: 0,
  });

  useEffect(() => {
    if (open) {
      const currentProduct = (window as any).currentEditProduct;
      if (currentProduct) {
        setFormData({
          id: currentProduct.id,
          name: currentProduct.name,
          description: currentProduct.description || '',
          category: currentProduct.category,
          price_per_unit: currentProduct.price_per_unit,
          status: currentProduct.status,
          quantity_available: currentProduct.quantity_available,
        });
      }
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setOpen(false);
    window.location.reload();  // Refresh
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Éditer Produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="legumes">Légumes</SelectItem>
                <SelectItem value="cereales">Céréales</SelectItem>
                <SelectItem value="autres">Autres</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price_per_unit">Prix par Unité (€)</Label>
            <Input
              id="price_per_unit"
              type="number"
              step="0.01"
              value={formData.price_per_unit}
              onChange={(e) => handleChange('price_per_unit', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="quantity_available">Quantité Disponible</Label>
            <Input
              id="quantity_available"
              type="number"
              value={formData.quantity_available}
              onChange={(e) => handleChange('quantity_available', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="sold_out">Épuisé</SelectItem>
                // components/admin/ProductEditModal.tsx (Suite - À partir de SelectContent)
                <SelectItem value="pending">En Attente</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Champs optionnels : harvest_date, expiry_date, organic_certified (si besoin) */}
          <div>
            <Label htmlFor="harvest_date">Date de Récolte (optionnel)</Label>
            <Input id="harvest_date" type="date" value={formData.harvest_date || ''} onChange={(e) => handleChange('harvest_date', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="organic_certified">Certifié Bio</Label>
            <Select value={formData.organic_certified ? 'true' : 'false'} onValueChange={(v) => handleChange('organic_certified', v === 'true')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Non</SelectItem>
                <SelectItem value="true">Oui</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Sauvegarder</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
