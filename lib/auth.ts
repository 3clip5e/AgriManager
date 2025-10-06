     // lib/auth.ts (version clean : Pas de handler, debug full, signIn simple)
     import NextAuth from "next-auth";
     import CredentialsProvider from "next-auth/providers/credentials";
     import GoogleProvider from "next-auth/providers/google";
     import { db } from "@/lib/database";
     import bcrypt from "bcryptjs";

     export const authOptions = {
       providers: [
         CredentialsProvider({
           name: "credentials",
           credentials: {
             email: { label: "Email", type: "email" },
             password: { label: "Password", type: "password" },
           },
           async authorize(credentials) {
             console.log("🔍 Authorize: Début pour email=", credentials?.email);  // Debug entrée
             if (!credentials?.email || !credentials?.password) {
               console.log("❌ Credentials manquants");
               throw new Error("Email et mot de passe requis");  // → result.error
             }

             try {
               console.log("🔍 DB: SELECT user pour", credentials.email);
               const [users] = await db.execute(
                 "SELECT id, email, name, password, role FROM users WHERE email = ?",
                 [credentials.email]
               );
               console.log("🔍 DB: Users trouvés=", users.length);  // Debug résultat

               const user = users[0];
               if (!user) {
                 console.log("❌ User non trouvé:", credentials.email);
                 return null;  // → "CredentialsSignin"
               }

               const isValid = await bcrypt.compare(credentials.password, user.password);  // Async
               if (!isValid) {
                 console.log("❌ Password incorrect:", credentials.email);
                 return null;
               }

               const role = user.role || 'buyer';
               console.log("✅ Authorize OK: ", user.email, "rôle=", role);

               const { password, ...safeUser  } = user;
               return safeUser ;

             } catch (error) {
               console.error("❌ Authorize DB Error:", error.code || error.message);  // e.g., ER_TIMEOUT
               throw new Error(`Erreur DB connexion: ${error.message}`);  // Throw → result.error clair
             }
           },
         }),
         ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
           GoogleProvider({
             clientId: process.env.GOOGLE_CLIENT_ID!,
             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
           })
         ] : []),
       ],
       callbacks: {
         async jwt({ token, user }) {
           if (user) {
             token.role = user.role;
             console.log("🔍 JWT: Rôle ajouté=", user.role);
           }
           return token;
         },
         async session({ session, token }) {
           if (session.user && token) {
             session.user.id = token.sub as string;
             session.user.role = token.role as string;
             console.log("🔍 Session: Rôle=", session.user.role);
           }
           return session;
         },
         async signIn({ user, account }) {
           console.log("🔍 SignIn: Provider=", account?.provider, "User =", user?.email);
           return true;  // Simple : Pas d'URL retour (middleware gère rôle post-redirect)
         },
         async redirect({ url, baseUrl }) {
           console.log("🔍 Redirect: URL=", url);
           if (url.startsWith("/api/auth/signin") || url.includes("error")) {
             return `${baseUrl}/auth/login`;  // Erreurs → login
           }
           return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;  // Default dashboard
         },
       },
       pages: {
         signIn: "/auth/login",
         error: "/auth/login",  // Erreurs visibles sur login
       },
       session: { strategy: "jwt" },
       secret: process.env.NEXTAUTH_SECRET,
       debug: process.env.NODE_ENV === "development",  // Logs NextAuth
     };

     // SUPPRIMEZ : Pas d'export handler ici (conflit avec route.ts)
     