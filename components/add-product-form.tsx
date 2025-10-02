"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Erreur lors de la création du produit")
      }

      // ✅ Redirection après succès
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Nom du produit"
        className="w-full rounded border p-2"
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Prix"
        className="w-full rounded border p-2"
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        className="w-full rounded border p-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  )
}