import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { LayoutGrid, Filter, UserPlus, MessageSquare, FileText, ShieldCheck } from "lucide-react";

// Server Actions & Modals
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { NewRequestSheet } from "@/components/requests/new-request-sheet";
import { getTemplatesAction } from "@/actions/templates";

// Modular UI Components
import { MetricCard } from "@/components/dashboard/metric-card";
import { SmartTaskQueue } from "@/components/dashboard/smart-task-queue";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function DashboardOverviewPage() {
    const session = await auth();
    const userId = session?.user?.id as string;

    if (!userId) {
        // This should be handled by the middleware/auth callback, but adding a guard for TS
        return null;
    }

    // 1. Fetch Backend Data
    const caClients = await db.select().from(clients).where(eq(clients.caId, userId));
    const availableTemplates = await getTemplatesAction();

    const allRequests = await db
        .select({
            id: requests.id,
            clientName: clients.name,
            documentType: requests.documentType,
            status: requests.status,
            updatedAt: requests.updatedAt,
        })
        .from(requests)
        .innerJoin(clients, eq(requests.clientId, clients.id))
        .where(eq(requests.caId, userId))
        .orderBy(desc(requests.updatedAt));

    // 2. Calculate Real Metrics
    const pendingCount = allRequests.filter(r => r.status === "pending").length;
    const flaggedCount = allRequests.filter(r => r.status === "incorrect").length;
    const receivedCount = allRequests.filter(r => r.status === "completed").length;
    const totalRequests = allRequests.length || 1;
    const collectionRate = Math.round((receivedCount / totalRequests) * 100);

    // 3. Slice Data for Widgets
    const taskQueue = allRequests.filter(r => r.status !== "completed").slice(0, 3);
    const recentActivity = allRequests.slice(0, 4);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back, here's what needs your attention today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                        <LayoutGrid className="w-4 h-4" /> Customize
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <AddClientDialog customTrigger={
                        <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 shadow-sm">
                            <UserPlus className="w-4 h-4" /> Add Client
                        </button>
                    } />
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-4 gap-4">
                <MetricCard title="Pending Verifications" value={pendingCount.toString()} trend="+12%" isPositive />
                <MetricCard title="Messages Requiring Reply" value={flaggedCount.toString()} trend="-5%" isPositive={false} />
                <MetricCard title="Missing Documents" value={(pendingCount + flaggedCount).toString()} trend="+8%" isPositive />
                <MetricCard title="Collection Rate" value={`${collectionRate}%`} trend="+2.1%" isPositive />
            </div>

            {/* MIDDLE ROW */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-semibold text-slate-900">Document Collection Progress</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm">
                                <span className="flex items-center gap-1.5 text-slate-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Received {receivedCount}</span>
                                <span className="flex items-center gap-1.5 text-slate-600"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Chasing {pendingCount}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center justify-center min-h-[250px]">
                        <p className="text-slate-400 text-sm">Chart Component Goes Here</p>
                    </div>
                </div>
                <SmartTaskQueue tasks={taskQueue} />
            </div>

            {/* BOTTOM ROW */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <AddClientDialog customTrigger={
                            <button className="flex flex-col items-center justify-center gap-3 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition rounded-xl p-4 h-24">
                                <UserPlus className="w-5 h-5 text-slate-600" />
                                <span className="text-sm font-medium text-slate-700">Add New Client</span>
                            </button>
                        } />
                        <NewRequestSheet clients={caClients} templates={availableTemplates} customTrigger={
                            <button className="flex flex-col items-center justify-center gap-3 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition rounded-xl p-4 h-24">
                                <MessageSquare className="w-5 h-5 text-slate-600" />
                                <span className="text-sm font-medium text-slate-700">Start WhatsApp Campaign</span>
                            </button>
                        } />
                        <button className="flex flex-col items-center justify-center gap-3 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition rounded-xl p-4 h-24">
                            <FileText className="w-5 h-5 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">Request Documents</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-3 bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition rounded-xl p-4 h-24">
                            <ShieldCheck className="w-5 h-5 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">Verify Identity</span>
                        </button>
                    </div>
                </div>
                <RecentActivity activities={recentActivity} />
            </div>
        </div>
    );
}