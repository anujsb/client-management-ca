import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // 1. Find the user in the Neon database
                const userResult = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email as string))

                const user = userResult[0]

                if (!user) return null

                // 2. Verify the password
                const isPasswordValid = await compare(
                    credentials.password as string,
                    user.passwordHash
                )

                if (!isPasswordValid) return null

                // 3. Return the user object to NextAuth
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false
            }
            return true
        },
        // Attach the user ID to the session so we can use it in DB queries later
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string
            }
            return session
        }
    },
})