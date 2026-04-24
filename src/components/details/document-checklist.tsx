"use client";

import { FileText, MessageSquare, ListTodo, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function DocumentChecklist({ requests }: { requests: any[] }) {
    const verifiedCount = requests.filter(r => r.status === 'completed').length;

    return (
        <div className="col-span-2 flex flex-col gap-6">

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 px-2">
                <button className="flex items-center gap-2 pb-3 border-b-2 border-orange-500 text-orange-600 font-medium text-sm">
                    <FileText className="w-4 h-4" /> Documents <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none px-1.5 py-0 text-[10px] ml-1">{verifiedCount}/{requests.length || 1}</Badge>
                </button>
                <button className="flex items-center gap-2 pb-3 text-slate-500 hover:text-slate-700 font-medium text-sm transition">
                    <MessageSquare className="w-4 h-4" /> AI Chat Log
                </button>
                <button className="flex items-center gap-2 pb-3 text-slate-500 hover:text-slate-700 font-medium text-sm transition">
                    <ListTodo className="w-4 h-4" /> Tasks
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Document Checklist (FY 24)</h3>
                        <p className="text-xs text-slate-500 mt-1">Track and verify required tax documents.</p>
                    </div>
                    <button className="text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center gap-1.5">
                        + Request Doc
                    </button>
                </div>

                <div className="w-full">
                    <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-5">Document Name</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3">Last Updated</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    <div className="flex flex-col">
                        {requests.length === 0 ? (
                            <p className="py-6 text-center text-sm text-slate-500">No documents requested yet.</p>
                        ) : requests.map((req) => (
                            <div key={req.id} className="grid grid-cols-12 gap-4 py-4 border-b border-slate-50 dark:border-slate-800/50 items-center">
                                <div className="col-span-5 flex items-start gap-3">
                                    <div className={`mt-0.5 p-1.5 rounded flex-shrink-0 ${req.status === 'completed' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                                        {req.documentUrl ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">{req.documentType}</h4>
                                        {req.status === 'incorrect' ? (
                                            <p className="text-[10px] text-red-500 mt-0.5">Blurry image, needs re-upload</p>
                                        ) : (
                                            <p className="text-[10px] text-slate-500 mt-0.5">{req.documentUrl ? 'Uploaded via WhatsApp' : 'Not uploaded'}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider ${req.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                            req.status === 'incorrect' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                                        }`}>
                                        {req.status === 'completed' ? 'Verified' : req.status === 'incorrect' ? 'Flagged' : 'Chasing'}
                                    </Badge>
                                </div>

                                <div className="col-span-3 text-sm text-slate-600 dark:text-slate-400">
                                    {req.status === 'pending' ? '-' : new Date(req.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>

                                <div className="col-span-2 text-right">
                                    {req.status === 'incorrect' && (
                                        <button onClick={() => toast.success("Re-request queued via Twilio!")} className="text-[10px] font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 rounded hover:bg-slate-50 transition shadow-sm text-slate-700">Request Again</button>
                                    )}
                                    {req.status === 'pending' && (
                                        <button onClick={() => toast.success("Reminder dispatched!")} className="text-[10px] font-medium border border-orange-200 bg-orange-50 px-2 py-1 rounded hover:bg-orange-100 transition shadow-sm text-orange-700">Send Reminder</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Log Placeholder */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">AI Agent Conversation Log</h4>
                <p className="text-sm text-slate-500 mb-4 max-w-[250px]">View the automated chat history between the AI agent and the client.</p>
                <button className="border border-slate-200 dark:border-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition">View Full Transcript</button>
            </div>
        </div>
    );
}