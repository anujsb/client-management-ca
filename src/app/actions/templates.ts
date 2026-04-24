"use server";

import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, or, isNull } from "drizzle-orm";

export async function getTemplatesAction() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    // Return system templates (caId is null) or templates created by this CA
    const result = await db.select().from(templates).where(
        or(
            isNull(templates.caId),
            eq(templates.caId, session.user.id)
        )
    );

    return result;
}
