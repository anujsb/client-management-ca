import { auth } from "@/auth";
import { db } from "@/lib/db";
// REMOVED `tasks` from this import so it stops crashing
import { clients, requests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Users, FileText, CheckCircle2, AlertCircle, Play } from "lucide-react";
import { CollectionChart } from "@/components/dashboard/collection-chart";
import { NewRequestSheet } from "@/components/requests/new-request-sheet";
import { getTemplatesAction } from "@/app/actions/templates";

export default async function DashboardOverview() {
    const session = await auth();
    const userId = session?.user?.id as string;

    if (!userId) return null;

    // 1. Fetch only what exists in your database right now
    const caClients = await db.select().from(clients).where(eq(clients.caId, userId));
    const caRequests = await db.select().from(requests).where(eq(requests.caId, userId)).orderBy(desc(requests.updatedAt));

    // Fetch the templates from the file we just created
    const availableTemplates = await getTemplatesAction();

    // 2. Calculate Top Metrics (Swapped 'Tasks' for 'Docs Verified')
    const totalClients = caClients.length;
    const docsPending = caRequests.filter(r => r.status === 'pending').length;
    const docsFlagged = caRequests.filter(r => r.status === 'incorrect').length;
    const docsVerified = caRequests.filter(r => r.status === 'completed').length;

    // 3. Process Data for the Recharts Graph (Last 7 Days activity)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const chartData = last7Days.map(dateStr => {
        const dayReqs = caRequests.filter(r => new Date(r.updatedAt).toISOString().split('T')[0] === dateStr);
        return {
            date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
            received: dayReqs.filter(r => r.status === 'completed').length,
            chased: dayReqs.filter(r => r.status === 'pending' || r.status === 'incorrect').length,
        };
    });

    // 4. Get 5 most recent flagged or pending documents
    const recentActivity = caRequests
        .filter(r => r.status === 'incorrect' || r.status === 'pending')
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    return (
        <div className="max-w-[1600px] mx-auto pb-10">

            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here is what needs your attention today.</p>
                </div>
                <div className="flex gap-3">
                    <NewRequestSheet
                        clients={caClients}
                        templates={availableTemplates}
                        customTrigger={
                            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                                <Play className="w-4 h-4 fill-current" /> Start WhatsApp Campaign
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Top 4 Metrics Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Clients" value={totalClients} icon={<Users className="w-5 h-5 text-blue-500" />} />
                <MetricCard title="Documents Pending" value={docsPending} icon={<FileText className="w-5 h-5 text-orange-500" />} />
                <MetricCard title="Flagged by AI" value={docsFlagged} icon={<AlertCircle className="w-5 h-5 text-red-500" />} />
                <MetricCard title="Docs Verified" value={docsVerified} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} />
            </div>

            <div className="grid grid-cols-3 gap-6">

                {/* The Recharts Graph */}
                <div className="col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Document Collection (7 Days)</h3>
                        <p className="text-xs text-slate-500 mt-1">Volume of automated chases vs successfully verified documents.</p>
                    </div>
                    <CollectionChart data={chartData} />
                </div>

                {/* Action Center / Recent Activity */}
                <div className="col-span-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Action Required</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {recentActivity.length === 0 ? (
                            <div className="p-6 text-center text-sm text-slate-500">You are all caught up!</div>
                        ) : (
                            recentActivity.map((item: any, idx) => (
                                <div key={idx} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg cursor-pointer transition mb-1 flex gap-3 items-start">
                                    <div className={`mt-0.5 p-1.5 rounded-full ${item.status === 'incorrect' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {item.status === 'incorrect' ? <AlertCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {item.status === 'incorrect' ? 'Document Flagged' : 'Missing Document'}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 truncate w-48">
                                            {item.documentType} requires your attention.
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
                        <a href="/dashboard/inbox" className="text-xs font-medium text-orange-600 hover:text-orange-700">View All →</a>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Helper component for the top stat cards - FIXED shrink-0 tailwind warning
function MetricCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h4>
            </div>
        </div>
    );
}