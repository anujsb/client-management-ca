"use server";

// This provides the default WhatsApp templates for your Dispatch Drawers
export async function getTemplatesAction() {
    return [
        {
            id: "1",
            name: "Initial Document Request",
            body: "Hi {client_name}, we are starting your compliance work for FY 24. Please upload your {document_type} at your earliest convenience."
        },
        {
            id: "2",
            name: "Gentle Reminder",
            body: "Hi {client_name}, just a quick reminder that we are still waiting on your {document_type}. Please send it when possible."
        },
        {
            id: "3",
            name: "Urgent / Overdue Alert",
            body: "URGENT: Hi {client_name}, your {document_type} is overdue. Please upload it immediately so we can file your returns on time and avoid penalties."
        },
        {
            id: "4",
            name: "Re-upload Request (Blurry)",
            body: "Hi {client_name}, the {document_type} you uploaded was blurry or unreadable. Could you please take a clearer photo and send it again?"
        }
    ];
}