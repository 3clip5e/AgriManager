"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateFarmRecommendations, generateAIResponse } from "@/lib/ai-advisor"
import { revalidatePath } from "next/cache"
import { query, db } from "@/lib/database"

export async function generateRecommendations(farmId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  try {
    const [farmRows] = await query(
      `SELECT f.*, 
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', fi.id,
                  'name', fi.name,
                  'area', fi.area,
                  'soil_ph', fi.soil_ph,
                  'plantings', (
                    SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                        'id', p.id,
                        'variety', ct.name,
                        'planting_date', p.planted_date,
                        'planted_area', p.quantity_planted,
                        'status', p.status,
                        'crop_types', JSON_OBJECT(
                          'name', ct.name,
                          'category', ct.category
                        )
                      )
                    )
                    FROM plantings p
                    JOIN crop_types ct ON p.crop_type_id = ct.id
                    WHERE p.field_id = fi.id
                  )
                )
              ) as fields
       FROM farms f
       LEFT JOIN fields fi ON f.id = fi.farm_id
       WHERE f.id = ? AND f.user_id = ?
       GROUP BY f.id`,
      [farmId, session.user.id],
    )

    const farm = (farmRows as any[])[0]
    if (!farm) {
      throw new Error("Farm not found")
    }

    // Parse JSON fields
    farm.fields = JSON.parse(farm.fields || "[]")

    // Get recent weather data (mock for now)
    const weather = {
      temperature: 22,
      humidity: 65,
      rainfall: 2.5,
      conditions: "sunny",
    }

    // Prepare data for AI
    const farmData = {
      farmName: farm.name,
      location: farm.location,
      soilType: farm.soil_type,
      fields: farm.fields.map((field: any) => ({
        name: field.name,
        area: field.area,
        soilPh: field.soil_ph,
        plantings: (field.plantings || []).map((planting: any) => ({
          cropName: planting.crop_types.name,
          variety: planting.crop_types.name,
          plantingDate: planting.planted_date,
          plantedArea: planting.quantity_planted,
          status: planting.status,
        })),
      })),
      weather,
    }

    // Generate AI recommendations
    const recommendations = await generateFarmRecommendations(farmData)

    for (const rec of recommendations) {
      await query(
        `INSERT INTO ai_recommendations (user_id, type, title, content, priority, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          session.user.id,
          rec.type,
          rec.title,
          `${rec.content}\n\nAction Items:\n${rec.actionItems.map((item) => `• ${item}`).join("\n")}\n\nTimeframe: ${rec.timeframe}${rec.estimatedCost ? `\nEstimated Cost: €${rec.estimatedCost}` : ""}`,
          rec.priority,
          "active",
        ],
      )
    }

    revalidatePath("/dashboard/ai-advisor")
    return { success: true, count: recommendations.length }
  } catch (error) {
    console.error("Error generating recommendations:", error)
    throw error
  }
}

export async function askAIQuestion(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const question = formData.get("question")
  if (!question) {
    return { error: "Question is required" }
  }

  try {
    const [farmRows] = await db.query(
      `SELECT f.name, f.location, f.soil_type,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'name', fi.name,
                  'plantings', (
                    SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                        'crop_types', JSON_OBJECT(
                          'name', ct.name,
                          'category', ct.category
                        )
                      )
                    )
                    FROM plantings p
                    JOIN crop_types ct ON p.crop_type_id = ct.id
                    WHERE p.field_id = fi.id
                  )
                )
              ) as fields
       FROM farms f
       LEFT JOIN fields fi ON f.id = fi.farm_id
       WHERE f.user_id = ?
       GROUP BY f.id`,
      [session.user.id],
    )

    const farms = farmRows as any[]
    const context = farms
      ?.map((farm: any) => {
        const fields = JSON.parse(farm.fields || "[]")
        const crops = fields
          .flatMap((field: any) => (field.plantings || []).map((p: any) => p.crop_types.name))
          .filter(Boolean)
        return `Farm: ${farm.name} in ${farm.location}, grows: ${crops.join(", ")}`
      })
      .join("; ")

    const response = await generateAIResponse(question.toString(), context)

    return { success: true, response }
  } catch (error) {
    console.error("Error asking AI question:", error)
    return { error: "Failed to get AI response" }
  }
}

export async function dismissRecommendation(recommendationId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  try {
    await query(`UPDATE ai_recommendations SET status = 'dismissed' WHERE id = ? AND user_id = ?`, [
      recommendationId,
      session.user.id,
    ])

    revalidatePath("/dashboard/ai-advisor")
  } catch (error) {
    console.error("Error dismissing recommendation:", error)
    throw error
  }
}
