// src/lib/actions/auth.actions.ts
// Server Actions for signup + session helper.
// These run on the Node.js runtime — safe to use bcrypt and db here.

"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    firmName: z.string().min(2, "Firm name must be at least 2 characters"),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };

// ─── signup ───────────────────────────────────────────────────────────────────

export async function signupAction(
    formData: FormData
): Promise<ActionResult<{ email: string }>> {
    // Validate
    const raw = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        firmName: formData.get("firmName"),
    };

    const parsed = signupSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.errors[0]?.message ?? "Invalid input",
        };
    }

    const { name, email, password, firmName } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

    if (existing) {
        return { success: false, error: "An account with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await db.insert(users).values({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        firmName,
    });

    return { success: true, data: { email: normalizedEmail } };
}

// ─── login ────────────────────────────────────────────────────────────────────

export async function loginAction(
    formData: FormData
): Promise<ActionResult<void>> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Email and password are required" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false, // We handle redirect in the component
        });
        return { success: true, data: undefined };
    } catch (error: unknown) {
        // NextAuth throws specific error types
        const message =
            error instanceof Error ? error.message : "Invalid email or password";

        // AuthError types from next-auth
        if (message.includes("CredentialsSignin")) {
            return { success: false, error: "Invalid email or password" };
        }

        return { success: false, error: "Something went wrong. Please try again." };
    }
}

// ─── logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
    await signOut({ redirectTo: "/login" });
}

// ─── getCurrentUser ───────────────────────────────────────────────────────────
// Secure session helper — always call this in Server Components/Actions
// for the real auth check. Never rely solely on proxy.ts.

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const [user] = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            firmName: users.firmName,
            phone: users.phone,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

    return user ?? null;
}