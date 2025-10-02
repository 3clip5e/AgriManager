import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          name: string
          user_type: 'farmer' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name: string
          user_type?: 'farmer' | 'customer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string
          user_type?: 'farmer' | 'customer'
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          user_type: 'farmer' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          user_type?: 'farmer' | 'customer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          user_type?: 'farmer' | 'customer'
          created_at?: string
          updated_at?: string
        }
      }
      farms: {
        Row: {
          id: string
          user_id: string
          name: string
          location: string | null
          total_area: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
      }
      fields: {
        Row: {
          id: string
          farm_id: string
          name: string
          area: number
          soil_type: string | null
          soil_ph: number | null
          irrigation_type: string | null
          created_at: string
          updated_at: string
        }
      }
      crop_types: {
        Row: {
          id: string
          name: string
          category: string | null
          growing_season: string | null
          days_to_harvest: number | null
          created_at: string
        }
      }
      plantings: {
        Row: {
          id: string
          field_id: string
          crop_type_id: string
          planted_date: string
          expected_harvest_date: string | null
          actual_harvest_date: string | null
          quantity_planted: number | null
          quantity_harvested: number | null
          status: 'planted' | 'growing' | 'harvested' | 'failed'
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category: string | null
          price: number
          unit: string
          quantity_available: number
          harvest_date: string | null
          expiry_date: string | null
          organic: boolean
          image_url: string | null
          status: 'available' | 'sold_out' | 'expired'
          created_at: string
          updated_at: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          seller_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_amount: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          delivery_address: string | null
          delivery_date: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
      }
      ai_recommendations: {
        Row: {
          id: string
          user_id: string
          type: 'irrigation' | 'fertilization' | 'pest_control' | 'harvest' | 'general'
          title: string
          content: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          field_id: string | null
          crop_type_id: string | null
          is_read: boolean
          created_at: string
        }
      }
    }
  }
}
