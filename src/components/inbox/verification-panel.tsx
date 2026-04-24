import { useState, useTransition } from "react";
import { Check, AlertCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { updateDocumentStatusAction } from "@/app/actions/inbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function VerificationPanel({ request }: { request: any }) {
    const [isPending, startTransition] = useTransition();

    // Handle actual database updates
    const handleAction = (status: "completed" | "incorrect") => {
        startTransition(async () => {
            await updateDocumentStatusAction(request.id, status);
            toast.success(status === "completed" ? "Document Approved & Synced!" : "Document Rejected.");
        });
    };

    if (!request) return <div className="w-[360px] bg-white border-l p-6">Select a document</div>;

    return (
        <div className="w-[380px] flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0">

            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8"><AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{request.clientName.substring(0, 2)}</AvatarFallback></Avatar>
                    <div>
                        <h4 className="font-semibold text-sm text-slate-900">{request.clientName}</h4>
                        <p className="text-[10px] text-slate-500">Linked to: FY 2024</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Form (Visual only for MVP, since OCR extraction isn't in DB schema yet) */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm text-slate-900">Extracted Data</h3>
                        <span className="text-[10px] text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">🤖 AI Confidence: 64%</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Document Type</label>
                            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm flex justify-between">
                                {request.documentType} <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>

                        {request.status === 'incorrect' && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">Verification Issue</label>
                                <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm flex justify-between">
                                    Unreadable / Blur Detected <AlertCircle className="w-4 h-4 text-red-500" />
                                </div>
                                <p className="text-[10px] text-red-500">Please verify manually from image or request re-upload.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Real Audit Trail from Database */}
                <div>
                    <h3 className="font-semibold text-sm text-slate-900 mb-4">Document Audit Trail</h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">

                        {request.status === 'incorrect' && (
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-red-500 bg-white z-10 shrink-0"></div>
                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-4">
                                    <h4 className="font-semibold text-sm text-slate-900">Flagged by AI Agent</h4>
                                    <p className="text-[10px] text-slate-500 mb-1">{new Date(request.updatedAt).toLocaleString()}</p>
                                    <div className="bg-red-50 border border-red-100 rounded p-2 text-[10px] text-red-700">Reason: Image quality too low or incorrect document type detected.</div>
                                </div>
                            </div>
                        )}

                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-slate-300 bg-white z-10 shrink-0"></div>
                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-4">
                                <h4 className="font-semibold text-sm text-slate-900">Received via WhatsApp</h4>
                                <p className="text-[10px] text-slate-500 mb-1">Uploaded by client</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REAL ACTION BUTTONS */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white grid grid-cols-2 gap-2">
                <button
                    disabled={isPending}
                    className="col-span-2 sm:col-span-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium py-2.5 rounded-lg transition"
                >
                    Skip for now
                </button>
                <button
                    onClick={() => handleAction("incorrect")}
                    disabled={isPending}
                    className="col-span-2 sm:col-span-1 bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-medium py-2.5 rounded-lg transition"
                >
                    Reject / Re-upload
                </button>
                <button
                    onClick={() => handleAction("completed")}
                    disabled={isPending}
                    className="col-span-2 bg-[#1A4D45] hover:bg-[#133A34] text-white text-xs font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <Check className="w-4 h-4" /> Approve & Sync
                </button>
            </div>
        </div>
    );
}