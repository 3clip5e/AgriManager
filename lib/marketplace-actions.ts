"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

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
    const { error } = await supabase
      .from('products')
      .insert({
        user_id: session.user.id,
        name: name.toString(),
        description: description?.toString() || null,
        category: category.toString(),
        price: Number.parseFloat(pricePerUnit.toString()),
        unit: unit.toString(),
        quantity_available: Number.parseFloat(quantityAvailable.toString()),
        harvest_date: harvestDate?.toString() || null,
        expiry_date: expiryDate?.toString() || null,
        organic: organicCertified,
        status: 'available'
      })

    if (error) {
      console.error("Erreur création produit:", error)
      return { error: "Une erreur est survenue." }
    }

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
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*, users!products_user_id_fkey(name)')
      .eq('id', productId.toString())
      .maybeSingle()

    if (productError || !product) {
      return { error: "Product not found" }
    }

    const orderQuantity = Number.parseFloat(quantity.toString())
    const totalAmount = orderQuantity * product.price

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: session.user.id,
        seller_id: product.user_id,
        product_id: productId.toString(),
        quantity: orderQuantity,
        unit_price: product.price,
        total_amount: totalAmount,
        delivery_address: shippingAddress.toString(),
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Error creating order:", orderError)
      return { error: "Failed to create order" }
    }

    // Update product quantity
    const newQuantity = product.quantity_available - orderQuantity
    const { error: updateError } = await supabase
      .from('products')
      .update({
        quantity_available: newQuantity,
        status: newQuantity <= 0 ? 'sold_out' : 'available'
      })
      .eq('id', productId.toString())

    if (updateError) {
      console.error("Error updating product:", updateError)
    }

    revalidatePath("/marketplace")
    return { success: "Order placed successfully!", orderId: order.id }
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
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .eq('seller_id', session.user.id)

    if (error) {
      console.error("Error updating order status:", error)
      throw error
    }

    revalidatePath("/dashboard/marketplace")
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}
