import { query, db } from "@/lib/mysql"

export { db }

export { query }

export async function getFarmsWithFields(userId: string) {
  try {
    const sql = `
      SELECT 
        f.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', fi.id,
            'name', fi.name,
            'area', fi.area,
            'soil_type', fi.soil_type,
            'soil_ph', fi.soil_ph,
            'irrigation_type', fi.irrigation_type,
            'created_at', fi.created_at,
            'updated_at', fi.updated_at,
            'plantings', fi.plantings
          )
        ) as fields
      FROM farms f
      LEFT JOIN (
        SELECT 
          fi.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', p.id,
              'planted_date', p.planted_date,
              'expected_harvest_date', p.expected_harvest_date,
              'actual_harvest_date', p.actual_harvest_date,
              'quantity_planted', p.quantity_planted,
              'quantity_harvested', p.quantity_harvested,
              'status', p.status,
              'notes', p.notes,
              'crop_types', JSON_OBJECT(
                'name', ct.name,
                'category', ct.category
              )
            )
          ) as plantings
        FROM fields fi
        LEFT JOIN plantings p ON fi.id = p.field_id
        LEFT JOIN crop_types ct ON p.crop_type_id = ct.id
        GROUP BY fi.id
      ) fi ON f.id = fi.farm_id
      WHERE f.user_id = ?
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `

    const farms = await query(sql, [userId])
    return farms || []
  } catch (error) {
    console.error("Error fetching farms:", error)
    return []
  }
}

export async function getFarmById(farmId: string, userId: string) {
  try {
    const sql = `
      SELECT 
        f.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', fi.id,
            'name', fi.name,
            'area', fi.area,
            'soil_type', fi.soil_type,
            'soil_ph', fi.soil_ph,
            'irrigation_type', fi.irrigation_type,
            'created_at', fi.created_at,
            'updated_at', fi.updated_at,
            'plantings', fi.plantings
          )
        ) as fields
      FROM farms f
      LEFT JOIN (
        SELECT 
          fi.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', p.id,
              'planted_date', p.planted_date,
              'expected_harvest_date', p.expected_harvest_date,
              'actual_harvest_date', p.actual_harvest_date,
              'quantity_planted', p.quantity_planted,
              'quantity_harvested', p.quantity_harvested,
              'status', p.status,
              'notes', p.notes,
              'crop_types', JSON_OBJECT(
                'name', ct.name,
                'category', ct.category,
                'growing_season', ct.growing_season
              )
            )
          ) as plantings
        FROM fields fi
        LEFT JOIN plantings p ON fi.id = p.field_id
        LEFT JOIN crop_types ct ON p.crop_type_id = ct.id
        GROUP BY fi.id
      ) fi ON f.id = fi.farm_id
      WHERE f.id = ? AND f.user_id = ?
      GROUP BY f.id
      LIMIT 1
    `

    const results = await query(sql, [farmId, userId])
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error("Error fetching farm:", error)
    return null
  }
}

export async function getCropTypes() {
  try {
    const sql = "SELECT * FROM crop_types ORDER BY name"
    const cropTypes = await query(sql)
    return cropTypes || []
  } catch (error) {
    console.error("Error fetching crop types:", error)
    return []
  }
}

export async function getUserById(userId: string) {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [userId])
    const users = rows as any[]
    return users[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(userData: { id: string; email: string; name: string; password: string }) {
  try {
    await db.execute("INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)", [
      userData.id,
      userData.email,
      userData.name,
      userData.password,
    ])
    return true
  } catch (error) {
    console.error("Error creating user:", error)
    return false
  }
}
