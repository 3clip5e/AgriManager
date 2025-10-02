import { supabase } from "@/lib/supabase"

export { supabase as db }

export async function getFarmsWithFields(userId: string) {
  try {
    const { data: farms, error } = await supabase
      .from('farms')
      .select(`
        *,
        fields (
          *,
          plantings (
            *,
            crop_types (*)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching farms:", error)
      return []
    }

    return farms || []
  } catch (error) {
    console.error("Error fetching farms:", error)
    return []
  }
}

export async function getFarmById(farmId: string, userId: string) {
  try {
    const { data: farm, error } = await supabase
      .from('farms')
      .select(`
        *,
        fields (
          *,
          plantings (
            *,
            crop_types (*)
          )
        )
      `)
      .eq('id', farmId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error("Error fetching farm:", error)
      return null
    }

    return farm
  } catch (error) {
    console.error("Error fetching farm:", error)
    return null
  }
}

export async function getCropTypes() {
  try {
    const { data: cropTypes, error } = await supabase
      .from('crop_types')
      .select('*')
      .order('name')

    if (error) {
      console.error("Error fetching crop types:", error)
      return []
    }

    return cropTypes || []
  } catch (error) {
    console.error("Error fetching crop types:", error)
    return []
  }
}

export async function getUserById(userId: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(userData: { id: string; email: string; name: string; password: string; user_type?: string }) {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        password: userData.password,
        user_type: userData.user_type || 'customer'
      })

    if (error) {
      console.error("Error creating user:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error creating user:", error)
    return false
  }
}
