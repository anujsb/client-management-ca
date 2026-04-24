import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, and, or, desc } from "drizzle-orm";
import { evaluateClientReply } from "@/services/ai.service";
import { sendWhatsAppMessage } from "@/services/whatsapp.service";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const fromWhatsApp = formData.get("From") as string;
        const body = formData.get("Body") as string;
        const numMediaStr = formData.get("NumMedia") as string;
        const numMedia = parseInt(numMediaStr || "0");
        const mediaUrl = numMedia > 0 ? (formData.get("MediaUrl0") as string) : null;

        // 🛑 DEBUG LOG 1: What exactly did Twilio send?
        console.log("--- INCOMING WEBHOOK ---");
        console.log(`Body: "${body}"`);
        console.log(`NumMedia: ${numMedia}`);
        console.log(`MediaUrl0: ${mediaUrl}`);
        console.log("------------------------");

        const clientPhone = fromWhatsApp.replace("whatsapp:", "");

        const clientRecord = await db
            .select()
            .from(clients)
            .where(eq(clients.phone, clientPhone))
            .limit(1);

        if (!clientRecord.length) return new NextResponse("<Response></Response>", { status: 200, headers: { "Content-Type": "text/xml" } });

        const client = clientRecord[0];

        const activeRequests = await db
            .select()
            .from(requests)
            .where(
                and(
                    eq(requests.clientId, client.id),
                    or(eq(requests.status, "pending"), eq(requests.status, "incorrect"))
                )
            )
            .orderBy(desc(requests.createdAt))
            .limit(1);

        if (!activeRequests.length) return new NextResponse("<Response></Response>", { status: 200, headers: { "Content-Type": "text/xml" } });

        const activeRequest = activeRequests[0];

        const aiDecision = await evaluateClientReply(
            activeRequest.aiContext || "",
            body,
            mediaUrl
        );


        // 🛑 DEBUG LOG 2: What did Groq decide?
        console.log("--- AI DECISION ---");
        console.log(`Status: ${aiDecision.status}`);
        console.log(`Valid File?: ${aiDecision.validFileExtracted}`);
        console.log("-------------------");

        let updatedDocumentUrl = activeRequest.documentUrl;
        if (aiDecision.validFileExtracted && mediaUrl) {
            updatedDocumentUrl = activeRequest.documentUrl
                ? `${activeRequest.documentUrl},${mediaUrl}`
                : mediaUrl;
        }

        // 2. Memory Upgrade: Append the conversation history so the AI remembers what it already got!
        const updatedContext = `${activeRequest.aiContext}\n[System: Received document. Bot replied: "${aiDecision.replyMessage}"]`;

        // 3. Update the Database
        await db
            .update(requests)
            .set({
                status: aiDecision.status,
                documentUrl: updatedDocumentUrl,
                aiContext: updatedContext, // Save the memory!
                updatedAt: new Date()
            })
            .where(eq(requests.id, activeRequest.id));

        await sendWhatsAppMessage(client.phone, aiDecision.replyMessage);

        return new NextResponse("<Response></Response>", { status: 200, headers: { "Content-Type": "text/xml" } });

    } catch (error) {
        console.error("Webhook Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}