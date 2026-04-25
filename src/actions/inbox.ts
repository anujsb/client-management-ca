"use server";

import { db } from "@/lib/db";
import { requests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateDocumentStatusAction(requestId: string, newStatus: "completed" | "incorrect") {
    await db
        .update(requests)
        .set({
            status: newStatus,
            updatedAt: new Date()
        })
        .where(eq(requests.id, requestId));

    // Force the page to fetch the fresh data
    revalidatePath("/dashboard/inbox");
    revalidatePath("/dashboard");
}