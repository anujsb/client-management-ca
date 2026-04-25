import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { ChevronRight } from "lucide-react";

import { ClientHeader } from "@/components/details/client-header";
import { DocumentChecklist } from "@/components/details/document-checklist";
import { ClientTimeline } from "@/components/details/client-timeline";
import { getTemplatesAction } from "@/app/actions/templates";

// Next.js 15 uses a Promise for searchParams
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ClientDetailPage(props: Props) {
    const searchParams = await props.searchParams;
    const session = await auth();
    const userId = session?.user?.id as string;

    if (!userId) return null;

    const clientId = searchParams.id as string;
    let targetClient;

    // 1. Fetch the specific client if an ID is provided, otherwise fallback to latest
    if (clientId) {
        const result = await db.select().from(clients).where(and(eq(clients.caId, userId), eq(clients.id, clientId))).limit(1);
        targetClient = result[0];
    } else {
        const allClients = await db.select().from(clients).where(eq(clients.caId, userId)).orderBy(desc(clients.createdAt)).limit(1);
        targetClient = allClients[0];
    }

    if (!targetClient) {
        return (
            <div className="max-w-6xl mx-auto pb-10 pt-20 text-center">
                <h2 className="text-xl font-semibold text-slate-900">Client Not Found</h2>
                <p className="text-slate-500 mt-2">Please select a valid client from the management page.</p>
                <a href="/dashboard/clients" className="text-orange-500 hover:underline mt-4 inline-block">← Back to Clients</a>
            </div>
        );
    }

    // 2. Fetch data specific to THIS client
    const clientRequests = await db.select().from(requests).where(eq(requests.clientId, targetClient.id)).orderBy(desc(requests.updatedAt));
    const availableTemplates = await getTemplatesAction();

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

            <ClientHeader client={targetClient} globalStatus={globalStatus} templates={availableTemplates} />

            <div className="grid grid-cols-3 gap-6">
                <DocumentChecklist requests={clientRequests} />
                <ClientTimeline client={targetClient} requests={clientRequests} />
            </div>
        </div>
    );
}