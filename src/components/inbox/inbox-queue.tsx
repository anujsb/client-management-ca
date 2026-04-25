import { Filter, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function InboxQueue({ requests, selectedReqId, onSelect }: any) {
    const flagged = requests.filter((r: any) => r.status === "incorrect");
    const received = requests.filter((r: any) => r.status === "completed");

    return (
        <div className="w-[320px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 shrink-0">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Incoming Queue</h2>
                <div className="flex gap-2 text-slate-400">
                    <button><Filter className="w-4 h-4 hover:text-slate-600 transition" /></button>
                </div>
            </div>

            <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800">
                <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-normal cursor-pointer">All ({requests.length})</Badge>
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 font-normal cursor-pointer">Flagged ({flagged.length})</Badge>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 font-normal cursor-pointer">Received ({received.length})</Badge>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {requests.length === 0 ? (
                        <p className="p-6 text-sm text-center text-slate-500">No documents to review.</p>
                    ) : requests.map((req: any) => {
                        const isSelected = req.id === selectedReqId;
                        return (
                            <div key={req.id}>
                                <div
                                    onClick={() => onSelect(req.id)}
                                    className={`p-4 cursor-pointer transition ${isSelected ? 'border-l-4 border-l-orange-500 bg-white dark:bg-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${req.status === 'incorrect' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                <FileIcon type={req.documentType} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate w-[160px]">{req.clientName}</h4>
                                                <p className="text-[10px] text-slate-500 truncate w-[160px]">{req.documentType}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(req.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-2 ml-11">
                                        <Badge className={`border-none text-[10px] px-1.5 py-0 ${req.status === 'incorrect' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                            {req.status === 'incorrect' ? 'Flagged' : 'Received'}
                                        </Badge>
                                        <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] px-1.5 py-0">via WhatsApp</Badge>
                                    </div>
                                </div>
                                <Separator />
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}

// Quick helper for icons
function FileIcon({ type }: { type: string }) {
    if (type.toLowerCase().includes('bank')) return <span className="font-bold text-xs">PDF</span>;
    if (type.toLowerCase().includes('pan') || type.toLowerCase().includes('kyc')) return <span className="font-bold text-xs">IMG</span>;
    return <FileText className="w-4 h-4" />;
}
import { FileText } from "lucide-react";