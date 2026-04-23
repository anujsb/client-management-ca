"use server"

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function registerAdminCA(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password || !name) throw new Error("Missing fields")

    const hashedPassword = await hash(password, 10)

    await db.insert(users).values({
        name,
        email,
        passwordHash: hashedPassword,
    })

    return { success: true }
}