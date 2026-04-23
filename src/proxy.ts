// proxy.ts  ← MUST be named proxy.ts in Next.js 16 (not middleware.ts)
// Runs on the EDGE runtime — only import auth.config.ts here, never auth.ts.
// auth.ts imports bcrypt + drizzle which are Node.js-only and will crash edge.
//
// SECURITY NOTE (CVE-2025-29927):
// This proxy provides a first layer of redirect-based protection (UX convenience).
// It is NOT the security boundary. All Server Components and API routes
// independently verify the session via `auth()` from auth.ts.
// Never trust proxy/middleware as the sole auth check.

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Export as `proxy` — required by Next.js 16.
// Next.js 15 used `export default` + named `middleware`. Next.js 16 needs this.
export const proxy = auth;

export const config = {
    // Only run on dashboard routes.
    // Explicit paths > broad negative lookahead — avoids ERR_TOO_MANY_REDIRECTS
    // that occurs when the broad pattern intercepts /api/auth/* routes.
    matcher: [
        "/dashboard/:path*",
    ],
};