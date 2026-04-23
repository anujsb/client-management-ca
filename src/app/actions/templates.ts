"use server";

import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, or, isNull } from "drizzle-orm";

export async function getTemplatesAction() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Fetch global templates (caId is null) AND templates created by this specific CA
    const availableTemplates = await db
        .select()
        .from(templates)
        .where(
            or(
                isNull(templates.caId),
                eq(templates.caId, session.user.id as string)
            )
        );

    return availableTemplates;
}