import { MoreHorizontal } from "lucide-react";

type MetricProps = {
    totalClients: number;
    activeRequests: number;
    docsReceived: number;
    chasingStatus: number;
};

export function ClientMetrics({ totalClients, activeRequests, docsReceived, chasingStatus }: MetricProps) {
    return (
        <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard title="Total Clients" value={totalClients.toString()} trend="+12%" isPositive />
            <MetricCard title="Active Requests" value={activeRequests.toString()} trend="-8%" isPositive={false} />
            <MetricCard title="Docs Received" value={docsReceived.toString()} trend="+11%" isPositive />
            <MetricCard title="Chasing Status" value={chasingStatus.toString()} trend="+13%" isPositive />
        </div>
    );
}

function MetricCard({ title, value, trend, isPositive }: { title: string, value: string, trend: string, isPositive: boolean }) {
    return (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h4>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            <div>
                <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</span>
                    <span className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trend}
                    </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">from last month</p>
            </div>
        </div>
    );
}