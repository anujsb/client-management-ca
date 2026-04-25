"use server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addClientAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const gstin = formData.get("gstin") as string;
    const phone = formData.get("phone") as string;

    if (!name || !gstin || !phone) {
        throw new Error("Missing required fields");
    }

    await db.insert(clients).values({
        caId: session.user.id,
        name,
        gstin,
        phone,
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");
    
    return { success: true };
}
