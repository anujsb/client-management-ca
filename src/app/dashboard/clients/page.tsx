import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Filter, UserPlus, LayoutGrid } from "lucide-react";

import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { ClientMetrics } from "@/components/clients/client-metrics";
import { ClientDataTable } from "@/components/clients/client-data-table";
import { getTemplatesAction } from "@/app/actions/templates";

export default async function ClientsPage() {
    const session = await auth();
    const userId = session?.user?.id as string;

    if (!userId) return null;

    const caClients = await db.select().from(clients).where(eq(clients.caId, userId)).orderBy(desc(clients.createdAt));
    const caRequests = await db.select().from(requests).where(eq(requests.caId, userId));
    const availableTemplates = await getTemplatesAction();

    const totalClients = caClients.length;
    const activeRequestsCount = caRequests.filter(r => r.status !== 'completed').length;
    const docsReceivedCount = caRequests.filter(r => r.status === 'completed').length;
    const chasingStatusCount = caRequests.filter(r => r.status === 'pending').length;

    const formattedClients = caClients.map(client => {
        const clientReqs = caRequests.filter(r => r.clientId === client.id);
        let globalStatus = 'Pending';
        let lastContactDate = null;

        if (clientReqs.length > 0) {
            const sortedReqs = [...clientReqs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            lastContactDate = new Date(sortedReqs[0].updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (clientReqs.some(r => r.status === 'incorrect')) globalStatus = 'Flagged';
            else if (clientReqs.some(r => r.status === 'pending')) globalStatus = 'Chasing';
            else globalStatus = 'Received';
        }

        return { ...client, globalStatus, lastContactDate };
    });

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Client Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your clients, track document status, and assign tasks.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                        <LayoutGrid className="w-4 h-4" /> Manage
                    </button>
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <AddClientDialog customTrigger={
                        <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition shadow-sm">
                            <UserPlus className="w-4 h-4" /> Add Client
                        </button>
                    } />
                </div>
            </div>

            <ClientMetrics totalClients={totalClients} activeRequests={activeRequestsCount} docsReceived={docsReceivedCount} chasingStatus={chasingStatusCount} />
            <ClientDataTable clientsData={formattedClients} templates={availableTemplates} />
        </div>
    );
}