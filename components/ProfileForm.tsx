"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import Loader from "@/components/Loader";
import { useApiStatus } from "@/hooks/useApiStatus";

export default function ProfileForm() {
  const [user, setUser] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading, saving, run } = useApiStatus();

  useEffect(() => {
    run(async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (!res.ok) throw new Error("Erreur lors du chargement du profil");
      setUser(data);
    }, { errorMsg: "Erreur lors du chargement du profil" });
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader /></div>;
  if (!user) return <p>Utilisateur non trouvé</p>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await run(async () => {
      const formData = new FormData(e.currentTarget);
      const body: any = {
        full_name: formData.get("full_name"),
        phone: formData.get("phone"),
        address: formData.get("address"),
      };

      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        body.imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(imageFile);
        });
      } else {
        body.imageUrl = user.image;
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du profil");
      setUser({ ...user, ...body, image: data.imageUrl || user.image });
      setPreviewImage(null);
    }, { successMsg: "Profil mis à jour ✅", errorMsg: "Erreur lors de la mise à jour ❌", isSaving: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <div className="flex flex-col items-center mb-6 relative group">
        <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <Avatar className="h-24 w-24 mb-2">
            <AvatarImage src={previewImage || user.image || "/placeholder.svg"} />
            <AvatarFallback>{user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-gray-700">{user.email}</p>
        <Input type="file" name="image" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      </div>

      <Input type="text" name="full_name" defaultValue={user.full_name} placeholder="Nom complet" />
      <Input type="text" name="phone" defaultValue={user.phone} placeholder="Téléphone" />
      <Input type="text" name="address" defaultValue={user.address} placeholder="Adresse" />

      <Button type="submit" disabled={saving} className="flex items-center gap-2">
        {saving ? <><Loader /> Sauvegarde...</> : "Mettre à jour"}
      </Button>
    </form>
  );
}
