"use client";

import { useState } from "react";
import { InboxQueue } from "./inbox-queue";
import { DocumentViewer } from "./document-viewer";
import { VerificationPanel } from "./verification-panel";

export function InboxWorkspace({ requests }: { requests: any[] }) {
    // 1. REAL FUNCTIONALITY: Master State
    const defaultReq = requests.length > 0 ? requests[0].id : null;
    const [selectedReqId, setSelectedReqId] = useState<string | null>(defaultReq);

    const activeRequest = requests.find(r => r.id === selectedReqId) || null;

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <InboxQueue
                requests={requests}
                selectedReqId={selectedReqId}
                onSelect={setSelectedReqId}
            />
            <DocumentViewer documentUrl={activeRequest?.documentUrl} />
            <VerificationPanel request={activeRequest} />
        </div>
    );
}