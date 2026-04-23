import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        // Twilio sends data as form data
        const formData = await req.formData();

        // Extract incoming message details
        const fromWhatsApp = formData.get("From") as string; // e.g., "whatsapp:+919876543210"
        const body = formData.get("Body") as string; // The text the client typed
        const numMedia = parseInt((formData.get("NumMedia") as string) || "0"); // Number of attached files

        // Clean the phone number to match our DB (remove "whatsapp:" prefix)
        const clientPhone = fromWhatsApp.replace("whatsapp:", "");

        // 1. Find the client by phone number
        const clientRecord = await db
            .select()
            .from(clients)
            .where(eq(clients.phone, clientPhone))
            .limit(1);

        if (!clientRecord.length) {
            console.log("Unrecognized number:", clientPhone);
            return new NextResponse("Not our client", { status: 200 }); // Return 200 so Twilio stops retrying
        }

        const client = clientRecord[0];

        // 2. Find their active request (pending or incorrect status)
        const activeRequests = await db
            .select()
            .from(requests)
            .where(
                and(
                    eq(requests.clientId, client.id),
                    or(eq(requests.status, "pending"), eq(requests.status, "incorrect"))
                )
            )
            .limit(1);

        if (!activeRequests.length) {
            console.log("No active requests for client:", client.name);
            return new NextResponse("No active request", { status: 200 });
        }

        const activeRequest = activeRequests[0];

        // TODO: Step 3 - Send 'body', 'numMedia', and 'activeRequest.aiContext' to Groq
        console.log(`Received from ${client.name}: "${body}". Attached files: ${numMedia}`);
        console.log(`Original Request: ${activeRequest.aiContext}`);

        // Return 200 immediately to acknowledge Twilio's webhook
        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}