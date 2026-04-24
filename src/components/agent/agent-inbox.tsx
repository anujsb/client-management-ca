import { Filter, Edit } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function AgentInbox({ clients, requests, selectedClientId, onSelectClient }: any) {
    return (
        <div className="w-[320px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex-shrink-0">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">Inbox</h2>
                <div className="flex gap-2 text-slate-400">
                    <button><Filter className="w-4 h-4" /></button>
                    <button><Edit className="w-4 h-4" /></button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {clients.map((client: any) => {
                        // Find this client's latest request to determine their status
                        const clientRequests = requests.filter((r: any) => r.clientId === client.id);
                        const latestRequest = clientRequests[0];
                        const isSelected = client.id === selectedClientId;

                        return (
                            <div key={client.id}>
                                <div
                                    onClick={() => onSelectClient(client.id)}
                                    className={`p-4 cursor-pointer transition ${isSelected ? 'border-l-4 border-l-orange-500 bg-white dark:bg-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                                    {client.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{client.name}</h4>
                                                <p className="text-xs text-slate-500 truncate w-40">{client.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {latestRequest && (
                                        <div className="flex gap-2 mt-2 ml-13">
                                            <Badge className={`border-none text-[10px] px-1.5 py-0 ${latestRequest.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    latestRequest.status === 'incorrect' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {latestRequest.status === 'incorrect' ? 'Flagged' : latestRequest.status === 'pending' ? 'Chasing' : 'Received'}
                                            </Badge>
                                            <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] px-1.5 py-0">
                                                {latestRequest.documentType}
                                            </Badge>
                                        </div>
                                    )}
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