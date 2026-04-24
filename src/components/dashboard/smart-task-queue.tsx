import { MessageSquare } from "lucide-react";

type Task = { id: string; clientName: string | null; documentType: string; status: string };

export function SmartTaskQueue({ tasks }: { tasks: Task[] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-900">Smart Task Queue</h3>
                <a href="#" className="text-orange-500 text-sm font-medium hover:underline">View All</a>
            </div>
            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No pending tasks!</p>
                ) : tasks.map((task) => (
                    <div key={task.id} className="border border-slate-100 bg-slate-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm text-slate-900">{task.documentType}</h4>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${task.status === 'incorrect' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                {task.status === 'incorrect' ? 'Flagged' : 'Chasing'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{task.clientName} • AI Agent Active</p>
                        <div className="flex justify-between items-center">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <MessageSquare className="w-3 h-3 text-green-600" />
                            </div>
                            <button className="text-xs font-medium bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm hover:bg-slate-50">
                                Review
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}