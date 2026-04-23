"use server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// E.164 Regex: Starts with '+', followed by 1-14 digits.
const E164_REGEX = /^\+[1-9]\d{1,14}$/;

export async function addClientAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const gstin = formData.get("gstin") as string;
    let phone = formData.get("phone") as string;

    if (!name || !gstin || !phone) {
        throw new Error("Missing required fields");
    }

    // Strip spaces/dashes just in case the user typed them
    phone = phone.replace(/[\s-]/g, "");

    if (!E164_REGEX.test(phone)) {
        throw new Error("Invalid phone number. Must be in E.164 format (e.g., +919876543210)");
    }

    await db.insert(clients).values({
        caId: session.user.id,
        name,
        gstin,
        phone,
    });

    revalidatePath("/dashboard");

    return { success: true };
}