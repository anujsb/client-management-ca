type Activity = { id: string; clientName: string | null; documentType: string; status: string; updatedAt: Date };

export function RecentActivity({ activities }: { activities: Activity[] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                <button className="text-slate-400 hover:text-slate-600">•••</button>
            </div>
            <div className="space-y-6">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 relative">
                        {index !== activities.length - 1 && <div className="absolute left-2 top-6 bottom-[-24px] w-px bg-slate-100"></div>}
                        <div className={`w-4 h-4 rounded-full mt-1 shrink-0 z-10 ring-4 ring-white ${activity.status === 'completed' ? 'bg-emerald-500' :
                            activity.status === 'incorrect' ? 'bg-red-500' : 'bg-orange-500'
                            }`}></div>
                        <div>
                            <p className="text-sm text-slate-900">
                                <span className="font-semibold">{activity.clientName}</span>
                                {activity.status === 'completed' ? ' uploaded ' : activity.status === 'incorrect' ? ' flagged ' : ' was requested '}
                                <span className="font-medium text-slate-700">{activity.documentType}</span>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {new Date(activity.updatedAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} via WhatsApp
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}