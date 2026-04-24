import { auth } from "@/auth";
import { db } from "@/lib/db";
import { requests, clients } from "@/lib/db/schema";
import { eq, desc, ne, and, isNotNull } from "drizzle-orm";
import { InboxWorkspace } from "@/components/inbox/inbox-workspace";

export default async function InboxPage() {
    const session = await auth();
    const userId = session!.user.id as string;

    // 1. Fetch requests that actually have documents (not pending) for this CA
    const incomingRequests = await db
        .select({
            id: requests.id,
            clientId: requests.clientId,
            clientName: clients.name,
            documentType: requests.documentType,
            status: requests.status,
            documentUrl: requests.documentUrl,
            updatedAt: requests.updatedAt,
        })
        .from(requests)
        .innerJoin(clients, eq(requests.clientId, clients.id))
        .where(
            and(
                eq(requests.caId, userId),
                ne(requests.status, "pending"), // Must have received something
                isNotNull(requests.documentUrl) // Must have a Twilio link
            )
        )
        .orderBy(desc(requests.updatedAt));

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        Document Verification & Inbox
                        {incomingRequests.some(r => r.status === 'incorrect') && (
                            <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Flagged
                            </span>
                        )}
                    </h1>
                </div>
            </div>

            {/* Client-side interactive workspace */}
            <InboxWorkspace requests={incomingRequests} />
        </div>
    );
}