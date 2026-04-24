import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type AIResponse = {
    status: "completed" | "incorrect" | "pending"; // 'pending' means we are still waiting for more docs
    replyMessage: string;
    validFileExtracted: boolean; // Tells our DB whether to save the file link
};

// Helper function to securely download the Twilio image and convert to Base64
async function fetchTwilioMediaAsBase64(mediaUrl: string): Promise<string> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) throw new Error("Missing Twilio credentials");

    const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(mediaUrl, {
        headers: { Authorization: `Basic ${authHeader}` },
    });

    if (!response.ok) throw new Error(`Failed to fetch media`);

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
}

export async function evaluateClientReply(
    originalRequestText: string,
    clientReplyText: string,
    mediaUrl: string | null
): Promise<AIResponse> {

    // 1. Build the prompt instructions
    const systemPrompt = `
        You are a strict, professional Chartered Accountant (CA) assistant in India.
        Your job is to evaluate if a client has provided ALL the correct documents requested.

        Original Request & Conversation History:
        "${originalRequestText}"
        
        Client's latest text reply: "${clientReplyText || '[No text provided]'}"
        
        STRICT VERIFICATION RULES:
        1. Compare the attached image(s) to the list of requested documents.
        2. PARTIAL FULFILLMENT: If the user provided ONE of the requested documents (e.g., just the PAN card) but others are STILL MISSING, set status to "pending", set validFileExtracted to true, and reply politely acknowledging what was received while listing exactly what is still missing.
        3. FULL FULFILLMENT: If the user has provided ALL requested documents, set status to "completed", set validFileExtracted to true, and say 'Thank you, your profile is complete.'
        4. REJECTION: If the image is a RANDOM PHOTO (e.g., a selfie, a logo) or the wrong document, set status to "incorrect", set validFileExtracted to false, and ask them to upload the correct documents.
        
        IMPORTANT: You operate EXCLUSIVELY via WhatsApp. NEVER ask them to click a link.
        You MUST respond ONLY with a valid JSON object in this exact format:
        {
        "status": "completed" or "incorrect" or "pending",
        "replyMessage": "The message to send back to the client via WhatsApp",
        "validFileExtracted": true or false
        }
  `;

    try {
        let messagesContent: any[] = [{ type: "text", text: systemPrompt }];

        // 2. If there is a media URL, download it and attach it to the Groq request
        if (mediaUrl) {
            console.log("Downloading image from Twilio for AI Vision processing...");
            const base64Image = await fetchTwilioMediaAsBase64(mediaUrl);

            messagesContent.push({
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                },
            });
        }

        // 3. Call the Groq Vision Model
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: messagesContent,
                },
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        let content = chatCompletion.choices[0]?.message?.content || "{}";

        // NEW: Clean up the response just in case the AI wraps it in markdown (```json ... ```)
        content = content.replace(/```json/g, "").replace(/```/g, "").trim();

        const result = JSON.parse(content) as AIResponse;

        return result;
    } catch (error) {
        console.error("Groq Vision AI Error:", error);
        return {
            status: "incorrect",
            replyMessage: "We received your message, but our AI system had trouble reading the file. Could you please ensure it is a clear photo or PDF and send it again?",
            validFileExtracted: false
        };
    }
}