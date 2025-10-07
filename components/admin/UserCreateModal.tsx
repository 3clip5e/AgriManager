// components/admin/UserCreateModal.tsx (Modal Création User)
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function UserCreateModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'buyer' as 'buyer' | 'farmer' | 'admin',
    farm_name: '',
    city: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setOpen(false);
    setFormData({ email: '', password: '', name: '', role: 'buyer', farm_name: '', city: '', phone: '' });  // Reset
    // Refresh table : dispatch event ou parent callback
    window.location.reload();  // Simplifié ; mieux avec callback
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter Utilisateur</Button>  // Déplacé ici si pas dans page
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
          <DialogDescription>Remplissez les détails pour créer un compte.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Mot de Passe</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
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
          <div>
            <Label htmlFor="farm_name">Nom de Ferme (optionnel)</Label>
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
          <DialogFooter>
            <Button type="submit">Créer</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
