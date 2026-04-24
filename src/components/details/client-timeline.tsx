import { Send, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ClientTimeline({ client, requests }: { client: any, requests: any[] }) {
    // Generate timeline events from real data
    const events = [];

    // 1. Creation event
    events.push({
        id: 'creation',
        title: 'Client profile created',
        desc: `Profile created by Elena Franci and assigned to FY 2024.`,
        date: new Date(client.createdAt),
        type: 'system'
    });

    // 2. Map request events
    requests.forEach(req => {
        if (req.status === 'completed') {
            events.push({
                id: req.id + '-comp',
                title: 'Document Received',
                desc: `AI WhatsApp Agent received ${req.documentType}.`,
                date: new Date(req.updatedAt),
                type: 'received'
            });
        }
        if (req.status === 'incorrect') {
            events.push({
                id: req.id + '-flag',
                title: 'Document Flagged',
                desc: `${req.documentType} was flagged by AI as blurry or incorrect.`,
                date: new Date(req.updatedAt),
                type: 'flagged'
            });
        }
    });

    // Sort latest first
    events.sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="col-span-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm h-full max-h-[800px]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Timeline & Activity</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">

                    {events.map((event) => (
                        <div key={event.id} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-950 z-10 shrink-0 mt-1 ${event.type === 'flagged' ? 'border-red-500' :
                                    event.type === 'received' ? 'border-emerald-500' :
                                        event.type === 'chasing' ? 'border-orange-500' : 'border-slate-300'
                                }`}></div>

                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">
                                    {event.date.toLocaleDateString()} • {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">{event.title}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{event.desc}</p>

                                {event.type === 'flagged' && <Badge className="bg-red-50 text-red-600 border-red-200 text-[10px] px-2 py-0.5 shadow-none font-normal">Status: Flagged</Badge>}
                                {event.type === 'chasing' && <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-[10px] px-2 py-0.5 shadow-none font-normal">Status: Chasing</Badge>}
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500/20">
                    <input type="text" placeholder="Add a note to timeline..." className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 dark:text-slate-200" />
                    <button className="text-orange-500 hover:text-orange-600"><Send className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
}