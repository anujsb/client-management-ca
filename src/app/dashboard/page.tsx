import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clients, requests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { NewRequestSheet } from "@/components/requests/new-request-sheet";
import { getTemplatesAction } from "@/app/actions/templates";
import { Users, FileText, ExternalLink, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session!.user.id as string;

    // Fetch Clients
    const caClients = await db
        .select()
        .from(clients)
        .where(eq(clients.caId, userId))
        .orderBy(desc(clients.createdAt));

    const availableTemplates = await getTemplatesAction();

    // Fetch Requests (The Document Pipeline)
    const caRequests = await db
        .select({
            id: requests.id,
            clientName: clients.name,
            documentType: requests.documentType,
            status: requests.status,
            documentUrl: requests.documentUrl,
            updatedAt: requests.updatedAt,
        })
        .from(requests)
        .innerJoin(clients, eq(requests.clientId, clients.id))
        .where(eq(requests.caId, userId))
        .orderBy(desc(requests.updatedAt));

    return (
        <div className="space-y-12 max-w-6xl mx-auto pb-12">

            {/* SECTION 1: Client Directory */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Client Directory
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Manage clients and dispatch automated document collection pipelines.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <AddClientDialog />
                        <NewRequestSheet clients={caClients} templates={availableTemplates} />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {caClients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No clients yet</h3>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="font-semibold text-slate-700 h-11">Client Name</TableHead>
                                    <TableHead className="font-semibold text-slate-700 h-11">GSTIN</TableHead>
                                    <TableHead className="font-semibold text-slate-700 h-11">WhatsApp</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700 h-11">Added</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {caClients.map((client) => (
                                    <TableRow key={client.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium text-slate-900 py-3">{client.name}</TableCell>
                                        <TableCell className="text-slate-600 py-3 font-mono text-sm">{client.gstin}</TableCell>
                                        <TableCell className="text-slate-600 py-3 font-mono text-sm">{client.phone}</TableCell>
                                        <TableCell className="text-right text-slate-500 py-3 text-sm">
                                            {new Date(client.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            {/* SECTION 2: Document Pipeline */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-indigo-600" />
                        Active Document Pipeline
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Real-time status of your WhatsApp document requests.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {caRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <p className="text-sm text-slate-500">No active document requests. Dispatch one above!</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="font-semibold text-slate-700 h-11">Client</TableHead>
                                    <TableHead className="font-semibold text-slate-700 h-11">Document Requested</TableHead>
                                    <TableHead className="font-semibold text-slate-700 h-11">Status</TableHead>
                                    <TableHead className="font-semibold text-slate-700 h-11">Last Updated</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-700 h-11">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {caRequests.map((request) => (
                                    <TableRow key={request.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium text-slate-900 py-3">
                                            {request.clientName}
                                        </TableCell>
                                        <TableCell className="text-slate-700 py-3">
                                            {request.documentType}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            {request.status === "completed" && (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex w-fit items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Received
                                                </Badge>
                                            )}
                                            {request.status === "pending" && (
                                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none flex w-fit items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Chasing
                                                </Badge>
                                            )}
                                            {request.status === "incorrect" && (
                                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none flex w-fit items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Issue Flagged
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-500 py-3 text-sm">
                                            {new Date(request.updatedAt).toLocaleString('en-IN', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right py-3">
                                            {request.documentUrl ? (
                                                <a
                                                    href={request.documentUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 h-9 px-4 py-2 gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" /> View File
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Awaiting file</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}