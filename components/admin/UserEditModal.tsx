// components/admin/UserEditModal.tsx (Modal Édition User)
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function UserEditModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    name: '',
    role: 'buyer' as 'buyer' | 'farmer' | 'admin',
    farm_name: '',
    city: '',
    phone: '',
    suspend: false,
  });

  useEffect(() => {
    if (open) {
      const currentUser  = (window as any).currentEditUser ;
      if (currentUser ) {
        setFormData({
          id: currentUser .id,
          email: currentUser .email,
          name: currentUser .name,
          role: currentUser .role,
          farm_name: currentUser .farm_name || '',
          city: currentUser .city || '',
          phone: currentUser .phone || '',
          suspend: false,  // À fetch si colonne is_suspended
        });
      }
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setOpen(false);
    // Refresh table
    window.location.reload();
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Éditer Utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(v) => handleChange('role', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Acheteur</SelectItem>
                <SelectItem value="farmer">Fermier</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Champs profil optionnels (comme create) */}
          <div>
            <Label htmlFor="farm_name">Nom de Ferme</Label>
            <Input id="farm_name" value={formData.farm_name} onChange={(e) => handleChange('farm_name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input id="city" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Suspendre Compte</Label>
            <Select value={formData.suspend ? 'true' : 'false'} onValueChange={(v) => handleChange('suspend', v === 'true')}>
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
