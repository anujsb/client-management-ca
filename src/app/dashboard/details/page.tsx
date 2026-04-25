import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ChevronRight } from "lucide-react";

import { ClientHeader } from "@/components/details/client-header";
import { DocumentChecklist } from "@/components/details/document-checklist";
import { ClientTimeline } from "@/components/details/client-timeline";

export default async function ClientDetailPage() {
    const session = await auth();
    const userId = session?.user?.id as string;

    if (!userId) return null;

    // 1. Fetch real backend data (For demo, we grab the most recently added client)
    const allClients = await db.select().from(clients).where(eq(clients.caId, userId)).orderBy(desc(clients.createdAt)).limit(1);

    if (allClients.length === 0) {
        return <div className="p-10 text-center text-slate-500">No clients found. Please add a client first.</div>;
    }

    const targetClient = allClients[0];
    const clientRequests = await db.select().from(requests).where(eq(requests.clientId, targetClient.id)).orderBy(desc(requests.updatedAt));

    // Calculate Global Status
    let globalStatus = 'Pending';
    if (clientRequests.length > 0) {
        if (clientRequests.some(r => r.status === 'incorrect')) globalStatus = 'Flagged';
        else if (clientRequests.some(r => r.status === 'pending')) globalStatus = 'Chasing';
        else globalStatus = 'Received';
    }

    return (
        <div className="max-w-6xl mx-auto pb-10">

            {/* Top Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <a href="/dashboard/clients" className="hover:text-slate-900 dark:hover:text-slate-300 transition">Clients</a>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-slate-900 dark:text-slate-100">{targetClient.name}</span>
            </div>

            <ClientHeader client={targetClient} globalStatus={globalStatus} />

            <div className="grid grid-cols-3 gap-6">
                <DocumentChecklist requests={clientRequests} />
                <ClientTimeline client={targetClient} requests={clientRequests} />
            </div>

        </div>
    );
}