import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER;

// Initialize Twilio client only if credentials exist
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppMessage(toPhone: string, messageBody: string) {
    if (!client || !twilioPhone) {
        throw new Error("Twilio credentials are not configured in environment variables.");
    }

    try {
        const message = await client.messages.create({
            body: messageBody,
            from: twilioPhone,
            to: `whatsapp:${toPhone}`,
        });

        return { success: true, messageId: message.sid };
    } catch (error) {
        console.error("Twilio send error:", error);
        throw new Error("Failed to dispatch WhatsApp message via Twilio.");
    }
}