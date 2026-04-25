"use server";

import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function signupAction(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // Note: firmName is collected but not currently in the schema, 
    // we can add it later if needed or ignore for now.

    if (!name || !email || !password) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        const hashedPassword = await hash(password, 10);
        await db.insert(users).values({
            name,
            email,
            passwordHash: hashedPassword,
        });
        return { success: true };
    } catch (error: any) {
        console.error("Signup error:", error);
        // Postgres unique violation code is usually "23505"
        if (error.message?.includes("unique constraint") || error.code === "23505") {
            return { success: false, error: "An account with this email already exists." };
        }
        return { success: false, error: "Failed to create account. Please try again." };
    }
}

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Please provide both email and password." };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Invalid email or password." };
                default:
                    return { success: false, error: "Something went wrong. Please try again." };
            }
        }
        // Next.js redirect throws an error, which is expected behavior for signIn
        if ((error as Error).message === "NEXT_REDIRECT") {
            return { success: true };
        }
        return { success: false, error: "Authentication failed." };
    }
}

export async function logoutAction() {
    await signOut();
}
