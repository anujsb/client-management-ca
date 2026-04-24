import { Mail, Phone, CheckCircle2, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ClientHeader({ client, globalStatus }: { client: any, globalStatus: string }) {
    return (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-start">
                <div className="flex gap-5">
                    <Avatar className="w-16 h-16 border-2 border-slate-100 dark:border-slate-800">
                        <AvatarFallback className="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 text-xl font-bold">
                            {client.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{client.name}</h2>
                            <Badge className={`border-none font-medium px-2 py-0.5 shadow-none ${globalStatus === 'Received' ? 'bg-emerald-50 text-emerald-700' :
                                    globalStatus === 'Flagged' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${globalStatus === 'Received' ? 'bg-emerald-500' :
                                        globalStatus === 'Flagged' ? 'bg-red-500' : 'bg-orange-500'
                                    }`}></div>
                                {globalStatus}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 border border-slate-400 rounded-sm"></div> Corporate</span>
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> contact@example.com</span>
                            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {client.phone}</span>
                        </div>

                        <div className="flex gap-2">
                            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 font-mono text-[10px] px-2">PAN ABCDE1234F</Badge>
                            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 font-mono text-[10px] px-2">GSTIN {client.gstin || "PENDING"}</Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mark Verified
                    </button>
                    <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                        <MessageSquare className="w-4 h-4" /> Message Agent
                    </button>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <span>Assigned Staff:</span>
                    <Avatar className="w-5 h-5"><AvatarImage src="https://i.pravatar.cc/150?img=5" /><AvatarFallback>EF</AvatarFallback></Avatar>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Elena Franci</span>
                </div>
                <div className="flex gap-4">
                    <span>Created: {new Date(client.createdAt).toLocaleDateString()}</span>
                    <span>Last Active: 2 hours ago</span>
                </div>
            </div>
        </div>
    );
}