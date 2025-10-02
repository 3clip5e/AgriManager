import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, userType } = await request.json()

    if (!email || !password || !name || !userType) {
      return NextResponse.json({ error: "Email, password, name, and user type are required" }, { status: 400 })
    }

    if (!['farmer', 'customer'].includes(userType)) {
      return NextResponse.json({ error: "User type must be 'farmer' or 'customer'" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = uuidv4()

    // Create user
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        password: hashedPassword,
        name,
        user_type: userType
      })

    if (userError) {
      console.error("User creation error:", userError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create corresponding profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email,
        full_name: name,
        user_type: userType
      })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
