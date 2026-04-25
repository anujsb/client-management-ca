"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export function ActiveChat({ client, requests }: any) {
    const activeRequest = requests[0];

    // 1. REAL FUNCTIONALITY: Chat Input State
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        // In Phase 2, this will hit a Next.js server action to send via WhatsApp Graph API
        toast.success(`Message queued for ${client.name}`);
        setMessage(""); // Clear input
    };

    return (
        <div className="flex-1 flex flex-col bg-[#F9F6F0] dark:bg-slate-900 relative">
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{client.name}</h3>
                        <p className="text-xs text-slate-500 font-mono">{client.phone}</p>
                    </div>
                </div>

                {/* DEAD UI COMMENTED OUT:
        <div className="flex items-center gap-6">
          <Switch /> <Search /> <MoreVertical />
        </div>
        */}
            </div>

            <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col space-y-6 max-w-3xl mx-auto">

                    {activeRequest && (
                        <div className="flex gap-3 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-orange-500 text-sm">🤖</span>
                            </div>
                            <div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                                        Hello! We are requesting the following document for your file:
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-3">
                                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2">Requested Document:</p>
                                        <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 space-y-1">
                                            <li>{activeRequest.documentType}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeRequest?.documentUrl && (
                        <div className="flex gap-3 max-w-[85%] self-end flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                <span className="text-indigo-700 text-xs font-bold">{client.name.substring(0, 1)}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="bg-[#FCEBD5] dark:bg-orange-900/30 p-2 rounded-2xl rounded-tr-sm shadow-sm">
                                    <div className="w-64 h-40 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg overflow-hidden relative">
                                        <img src={activeRequest.documentUrl} alt="Uploaded Doc" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 mr-1 flex items-center gap-1">Received <CheckCircle2 className="w-3 h-3 text-blue-500" /></span>
                            </div>
                        </div>
                    )}

                    {activeRequest?.status === 'incorrect' && (
                        <div className="flex justify-center">
                            <div className="bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 text-slate-600 dark:text-slate-400 text-xs px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Document was flagged by AI (Blurry/Incorrect)
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 max-w-3xl mx-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a manual WhatsApp message..."
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 dark:text-slate-200"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white p-2 rounded-full transition shadow-sm"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}