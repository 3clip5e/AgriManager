"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/database"

export async function createProduct(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: "Non authentifié." }
  }

  const name = formData.get("name")
  const description = formData.get("description")
  const category = formData.get("category")
  const pricePerUnit = formData.get("pricePerUnit")
  const unit = formData.get("unit")
  const quantityAvailable = formData.get("quantityAvailable")
  const harvestDate = formData.get("harvestDate")
  const expiryDate = formData.get("expiryDate")
  const organicCertified = formData.get("organicCertified") === "on"

  if (!name || !category || !pricePerUnit || !unit || !quantityAvailable) {
    return { error: "Les champs obligatoires sont manquants." }
  }

  try {
    await db.query(
      `INSERT INTO products (farmer_id, name, description, category, price_per_unit, unit, quantity_available, harvest_date, expiry_date, organic_certified, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.user.id,
        name.toString(),
        description?.toString() || null,
        category.toString(),
        Number.parseFloat(pricePerUnit.toString()),
        unit.toString(),
        Number.parseFloat(quantityAvailable.toString()),
        harvestDate?.toString() || null,
        expiryDate?.toString() || null,
        organicCertified,
        "available",
      ],
    )

    revalidatePath("/dashboard/marketplace")

    return { success: "Produit créé avec succès !" }
  } catch (error) {
    console.error("Erreur création produit:", error)
    return { error: "Une erreur est survenue." }
  }
}

export async function createOrder(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const productId = formData.get("productId")
  const quantity = formData.get("quantity")
  const shippingAddress = formData.get("shippingAddress")

  if (!productId || !quantity || !shippingAddress) {
    return { error: "Product, quantity, and shipping address are required" }
  }

  try {
    // Get product details
    const [productRows] = await db.query(
      `SELECT p.*, u.name as seller_name 
       FROM products p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = ?`,
      [productId.toString()],
    )

    const product = (productRows as any[])[0]
    if (!product) {
      return { error: "Product not found" }
    }

    const orderQuantity = Number.parseFloat(quantity.toString())
    const totalAmount = orderQuantity * product.price_per_unit

    // Create order
    const [orderResult] = await db.query(
      `INSERT INTO orders (buyer_id, seller_id, total_amount, shipping_address, status, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [session.user.id, product.user_id, totalAmount, shippingAddress.toString(), "pending", "pending"],
    )

    const orderId = (orderResult as any).insertId

    // Create order item
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) 
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, productId.toString(), orderQuantity, product.price_per_unit, totalAmount],
    )

    // Update product quantity
    const newQuantity = product.quantity_available - orderQuantity
    await db.query(`UPDATE products SET quantity_available = ?, status = ? WHERE id = ?`, [
      newQuantity,
      newQuantity <= 0 ? "sold_out" : "available",
      productId.toString(),
    ])

    revalidatePath("/marketplace")
    return { success: "Order placed successfully!", orderId: orderId.toString() }
  } catch (error) {
    console.error("Error creating order:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  try {
    await db.query(`UPDATE orders SET status = ? WHERE id = ? AND seller_id = ?`, [status, orderId, session.user.id])

    revalidatePath("/dashboard/marketplace")
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}
