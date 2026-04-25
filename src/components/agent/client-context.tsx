import { FileText, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ClientContext({ client, requests }: any) {
    return (
        <div className="w-[320px] flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Client Context</h3>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                            {client.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{client.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{client.gstin || "No GSTIN"}</p>
                    </div>
                </div>
            </div>

            {/* REAL DATABASE CHECKLIST */}
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Document Pipeline</h3>
            <div className="space-y-3 mb-4">
                {requests.length === 0 ? (
                    <p className="text-xs text-slate-500">No documents requested yet.</p>
                ) : (
                    requests.map((req: any) => (
                        <div key={req.id} className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                                <FileText className={`w-4 h-4 ${req.status === 'completed' ? 'text-emerald-400' : 'text-orange-400'}`} />
                                {req.documentType}
                            </span>
                            <Badge className={`font-normal shadow-none ${req.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                req.status === 'incorrect' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                                }`}>
                                {req.status === 'incorrect' ? 'Flagged' : req.status === 'pending' ? 'Missing' : 'Received'}
                            </Badge>
                        </div>
                    ))
                )}
            </div>

            <Separator className="my-6" />

            {/* Dynamic AI Compliance Note */}
            {requests.some((r: any) => r.status === 'incorrect') && (
                <>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Compliance Flags</h3>
                    <div className="bg-red-50 dark:bg-red-900/10 border-l-2 border-red-400 p-3 text-xs text-slate-700 dark:text-slate-300">
                        <p><span className="font-semibold text-slate-900 dark:text-slate-100">AI Alert:</span> One or more documents were flagged by the vision model for being blurry or incorrect.</p>
                    </div>
                </>
            )}
        </div>
    );
}