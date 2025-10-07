// components/add-product-form.tsx (Version Fallback - Sans react-hook-form/zod)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [harvestDate, setHarvestDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nom requis (min 3 chars)";
    if (price_per_unit <= 0) newErrors.price_per_unit = "Prix > 0 requis";
    if (!unit.trim()) newErrors.unit = "Unité requise";
    if (quantity_available <= 0) newErrors.quantity_available = "Quantité > 0 requise";
    if (!category) newErrors.category = "Catégorie requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload image si fournie (simplifié ; intégrez Cloudinary plus tard)
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "agrimanager");  // Configurez Cloudinary
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) imageUrl = uploadData.secure_url;
      }

      // Payload complet (tous champs DB)
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        category,
        price_per_unit: parseFloat(price_per_unit.toString()),
        unit: unit.trim(),
        quantity_available: parseInt(quantity_available.toString()),
        harvest_date: harvestDate || null,
        expiry_date: expiryDate || null,
        organic_certified: organicCertified,
        image_url: imageUrl,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Produit ajouté avec succès !");  // Remplacez par toast Shadcn plus tard
        // Reset form
        setName("");
        setDescription("");
        setCategory("autres");
        setPricePerUnit(0);
        setUnit("kg");
        setQuantityAvailable(1);
        setHarvestDate("");
        setExpiryDate("");
        setOrganicCertified(false);
        setImageFile(null);
        setImagePreview(null);
        setErrors({});
      } else {
        const error = await res.json();
        alert(`Erreur: ${error.error || "Échec ajout"}`);
      }
    } catch (error) {
      alert("Erreur réseau ou serveur");
      console.error("Erreur soumission:", error);
    } finally {
      setLoading(false);
    }
  };

  // États pour champs (vanilla)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("autres");
  const [price_per_unit, setPricePerUnit] = useState(0);
  const [unit, setUnit] = useState("kg");
  const [quantity_available, setQuantityAvailable] = useState(1);
  const [organicCertified, setOrganicCertified] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un Produit</CardTitle>
        <CardDescription>Remplissez les détails pour lister votre produit sur le marché.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Produit</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. : Tomates bio"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails sur le produit"
              rows={3}
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="legumes">Légumes</SelectItem>
                <SelectItem value="cereales">Céréales</SelectItem>
                <SelectItem value="autres">Autres</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Prix par Unité */}
          <div className="space-y-2">
            <Label htmlFor="price_per_unit">Prix par Unité (€)</Label>
            <Input
              id="price_per_unit"
              type="number"
              step="0.01"
              value={price_per_unit}
              onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
              placeholder="Ex. : 2.50"
            />
            {errors.price_per_unit && <p className="text-sm text-red-600">{errors.price_per_unit}</p>}
          </div>

          {/* Unité */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unité</Label>
            <Input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Ex. : kg, pièce"
              defaultValue="kg"
            />
            {errors.unit && <p className="text-sm text-red-600">{errors.unit}</p>}
          </div>

          {/* Quantité */}
          <div className="space-y-2">
            <Label htmlFor="quantity_available">Quantité Disponible</Label>
            <Input
              id="quantity_available"
              type="number"
              value={quantity_available}
              onChange={(e) => setQuantityAvailable(parseInt(e.target.value) || 1)}
              placeholder="Ex. : 50"
            />
            {errors.quantity_available && <p className="text-sm text-red-600">{errors.quantity_available}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de Récolte (optionnel)</Label>
              <Input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Date d'Expiration (optionnel)</Label>
              <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>
          </div>

          {/* Bio */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="organic_certified"
              checked={organicCertified}
              onCheckedChange={(checked) => setOrganicCertified(!!checked)}
            />
            <Label htmlFor="organic_certified">Certifié Bio</Label>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Photo (optionnel)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ajouter le Produit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
