"use server";

import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { sendWhatsAppMessage } from "@/services/whatsapp.service";
import { revalidatePath } from "next/cache";

export async function dispatchRequestAction(
    clientId: string,
    templateName: string,
    messageBody: string
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // 1. Fetch the client to ensure they exist and get their verified E.164 phone number
    const clientRecord = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);

    if (!clientRecord.length) {
        throw new Error("Client not found.");
    }

    const clientPhone = clientRecord[0].phone;

    // 2. Dispatch via Twilio
    await sendWhatsAppMessage(clientPhone, messageBody);

    // 3. Log the request in the database as "pending"
    await db.insert(requests).values({
        caId: session.user.id,
        clientId: clientId,
        documentType: templateName,
        status: "pending",
        aiContext: messageBody, // Store what was asked so the Groq LLM knows later
    });

    revalidatePath("/dashboard");
    return { success: true };
}