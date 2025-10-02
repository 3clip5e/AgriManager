import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials?.email)
          .single()

        if (error || !users || !(await bcrypt.compare(credentials!.password, users.password))) {
          return null
        }

        return { id: users.id, name: users.name, email: users.email, userType: users.user_type }
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userType = (user as any).userType
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.userType = token.userType as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/sign-up",
  },
}

export default NextAuth(authOptions)
