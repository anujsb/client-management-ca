"use client";

import { useState } from "react";
import { AgentInbox } from "./agent-inbox";
import { ActiveChat } from "./active-chat";
import { ClientContext } from "./client-context";

// Types based on your Drizzle schema
type Client = any; // Replace with typeof clients.$inferSelect if using strict TS
type Request = any; // Replace with typeof requests.$inferSelect

export function AgentWorkspace({ clients, requests }: { clients: Client[], requests: Request[] }) {
    // Default to the first client who has a request, or just the first client
    const defaultClient = clients.length > 0 ? clients[0].id : null;
    const [selectedClientId, setSelectedClientId] = useState<string | null>(defaultClient);

    const selectedClient = clients.find(c => c.id === selectedClientId) || null;
    const selectedClientRequests = requests.filter(r => r.clientId === selectedClientId);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <AgentInbox
                clients={clients}
                requests={requests}
                selectedClientId={selectedClientId}
                onSelectClient={setSelectedClientId}
            />

            {selectedClient ? (
                <>
                    <ActiveChat client={selectedClient} requests={selectedClientRequests} />
                    <ClientContext client={selectedClient} requests={selectedClientRequests} />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                    No active client selected.
                </div>
            )}
        </div>
    );
}