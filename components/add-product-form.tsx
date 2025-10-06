"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AddProductForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [pricePerUnit, setPricePerUnit] = useState("")
  const [unit, setUnit] = useState("")
  const [quantityAvailable, setQuantityAvailable] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [organicCertified, setOrganicCertified] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price_per_unit: parseFloat(pricePerUnit),
          unit,
          quantity_available: parseInt(quantityAvailable, 10),
          category,
          description,
          organic_certified: organicCertified,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add product")
      }

      toast.success("Produit ajouté avec succès")
      router.push("/dashboard/marketplace")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
      <div>
        <label htmlFor="name" className="block font-medium text-gray-700">
          Nom du produit
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="pricePerUnit" className="block font-medium text-gray-700">
          Prix par unité (€)
        </label>
        <input
          id="pricePerUnit"
          type="number"
          step="0.01"
          min="0"
          required
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="unit" className="block font-medium text-gray-700">
          Unité (ex: kg, pièce)
        </label>
        <input
          id="unit"
          type="text"
          required
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="quantityAvailable" className="block font-medium text-gray-700">
          Quantité disponible
        </label>
        <input
          id="quantityAvailable"
          type="number"
          min="0"
          required
          value={quantityAvailable}
          onChange={(e) => setQuantityAvailable(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-medium text-gray-700">
          Catégorie
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="organicCertified"
          type="checkbox"
          checked={organicCertified}
          onChange={(e) => setOrganicCertified(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="organicCertified" className="text-gray-700">
          Certifié biologique
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter le produit"}
      </button>
    </form>
  )
}
