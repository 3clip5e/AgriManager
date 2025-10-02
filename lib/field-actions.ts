"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { db, query } from "@/lib/database"

export async function createFarm(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: "Not authenticated" }

  const name = formData.get("name")?.toString()
  const location = formData.get("location")?.toString()
  const totalArea = parseFloat(formData.get("totalArea")?.toString() || "0")
  const soilType = formData.get("soilType")?.toString() || null
  const irrigationType = formData.get("irrigationType")?.toString() || null
  const organicCertified = formData.get("organicCertified") === "on"

  if (!name || !location || !totalArea) return { error: "Name, location, and total area are required" }

  try {
    await query(
      `INSERT INTO farms (user_id, name, location, total_area, soil_type, irrigation_type, organic_certified)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [session.user.id, name, location, totalArea, soilType, irrigationType, organicCertified]
    )

    revalidatePath("/dashboard/fields")
    redirect("/dashboard/fields")
  } catch (error) {
    console.error("Error creating farm:", error)
    return { error: "An unexpected error occurred" }
  }
}


export async function createField(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const farmId = formData.get("farmId")
  const name = formData.get("name")
  const area = formData.get("area")
  const soilPh = formData.get("soilPh")

  if (!farmId || !name || !area) {
    return { error: "Farm, name, and area are required" }
  }

  try {
    await query(`INSERT INTO fields (farm_id, name, area, soil_ph) VALUES (?, ?, ?, ?)`, [
      farmId.toString(),
      name.toString(),
      Number.parseFloat(area.toString()),
      soilPh ? Number.parseFloat(soilPh.toString()) : null,
    ])

    revalidatePath("/dashboard/fields")
    return { success: "Field created successfully" }
  } catch (error) {
    console.error("Error creating field:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function createPlanting(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const fieldId = formData.get("fieldId")
  const cropTypeId = formData.get("cropTypeId")
  const variety = formData.get("variety")
  const plantingDate = formData.get("plantingDate")
  const plantedArea = formData.get("plantedArea")
  const expectedYield = formData.get("expectedYield")

  if (!fieldId || !cropTypeId || !plantingDate || !plantedArea) {
    return { error: "Field, crop type, planting date, and planted area are required" }
  }

  try {
    const [cropTypeRows] = await db.query("SELECT days_to_maturity FROM crop_types WHERE id = ?", [
      cropTypeId.toString(),
    ])
    const cropType = (cropTypeRows as any[])[0]

    const plantingDateObj = new Date(plantingDate.toString())
    const expectedHarvestDate = new Date(plantingDateObj)
    if (cropType?.days_to_maturity) {
      expectedHarvestDate.setDate(plantingDateObj.getDate() + cropType.days_to_maturity)
    }

    await query(
      `INSERT INTO plantings (field_id, crop_type_id, variety, planting_date, expected_harvest_date, planted_area, expected_yield, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fieldId.toString(),
        cropTypeId.toString(),
        variety?.toString() || null,
        plantingDate.toString(),
        expectedHarvestDate.toISOString().split("T")[0],
        Number.parseFloat(plantedArea.toString()),
        expectedYield ? Number.parseFloat(expectedYield.toString()) : null,
        "planted",
      ],
    )

    revalidatePath("/dashboard/fields")
    return { success: "Planting recorded successfully" }
  } catch (error) {
    console.error("Error creating planting:", error)
    return { error: "An unexpected error occurred" }
  }
}
