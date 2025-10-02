import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createConnection } from "mysql2/promise"
import { v4 as uuidv4 } from "uuid"

const connection = createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "app_user",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || "agricultural_app",
})

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const conn = await connection

    // Check if user already exists
    const [existingUsers] = await conn.execute("SELECT id FROM users WHERE email = ?", [email])

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = uuidv4()

    // Create user
    await conn.execute("INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)", [
      userId,
      email,
      hashedPassword,
      name,
    ])

    // Create corresponding profile
await conn.execute(
  "INSERT INTO user_profiles (id, email, full_name) VALUES (?, ?, ?)",
  [userId, email, name]
)

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
