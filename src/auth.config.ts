// src/auth.config.ts
// Edge-safe Auth.js v5 config.
// CRITICAL: Do NOT import db, Drizzle, or bcrypt here.
// This file is imported by proxy.ts which runs on the edge runtime.
// Node.js-only modules will crash the edge runtime.

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/login",
        error: "/login", // redirect errors back to login with ?error= param
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        // Controls whether a request to a protected route is allowed.
        // Runs at the edge — keep it lightweight, JWT-only.
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnApi = nextUrl.pathname.startsWith("/api");

            // Let NextAuth's own API routes through unconditionally
            if (nextUrl.pathname.startsWith("/api/auth")) return true;

            if (isOnDashboard) {
                return isLoggedIn; // redirect to /login if not authed
            }

            // Redirect logged-in users away from login/signup
            if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true; // public routes
        },

        // Persist extra fields from DB user into the JWT token
        async jwt({ token, user }) {
            if (user) {
                // `user` is only present on sign-in
                token.id = user.id;
                token.firmName = (user as { firmName?: string }).firmName ?? null;
            }
            return token;
        },

        // Expose JWT fields to the session object
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as { firmName?: string | null }).firmName =
                    (token.firmName as string | null) ?? null;
            }
            return session;
        },
    },

    providers: [], // providers are added in auth.ts (not here)
};