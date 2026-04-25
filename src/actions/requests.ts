"use server";

import { db } from "@/lib/db";
import { requests, clients } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendWhatsAppMessage } from "@/services/whatsapp.service";

export async function dispatchRequestAction(clientId: string, documentType: string, messageBody: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // 1. Get client details for the phone number
    const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);

    if (!client) {
        throw new Error("Client not found");
    }

    // 2. Create the request in database
    await db.insert(requests).values({
        caId: session.user.id,
        clientId: clientId,
        documentType: documentType,
        status: "pending",
        aiContext: messageBody, // Store the message as context for the AI
    });

    // 3. Send the WhatsApp message via Twilio
    await sendWhatsAppMessage(client.phone, messageBody);

    // 4. Revalidate dashboard to show the new request
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/chases");
    
    return { success: true };
}
