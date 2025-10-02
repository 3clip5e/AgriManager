import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createPool } from "mysql2/promise"
import bcrypt from "bcryptjs"

const pool = createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "agricultural_app",
})

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [credentials?.email])
        const user = (rows as any[])[0]

        if (!user || !(await bcrypt.compare(credentials!.password, user.password))) {
          return null
        }

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/sign-up",
  },
}

export default NextAuth(authOptions)
