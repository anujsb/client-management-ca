import { auth } from "@/auth";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { AddClientDialog } from "@/components/clients/add-client-dialog";
import { NewRequestSheet } from "@/components/requests/new-request-sheet";
import { getTemplatesAction } from "@/app/actions/templates";
import { Users } from "lucide-react";
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

    const caClients = await db
        .select()
        .from(clients)
        .where(eq(clients.caId, session!.user.id as string))
        .orderBy(desc(clients.createdAt));

    const availableTemplates = await getTemplatesAction();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
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
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                            Add your first client to start automating your document collection process.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-200">
                                <TableHead className="font-semibold text-slate-700 h-11">Client Name</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">GSTIN</TableHead>
                                <TableHead className="font-semibold text-slate-700 h-11">WhatsApp</TableHead>
                                <TableHead className="text-right font-semibold text-slate-700 h-11">Added</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {caClients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-900 py-3">
                                        {client.name}
                                    </TableCell>
                                    <TableCell className="text-slate-600 py-3 font-mono text-sm">{client.gstin}</TableCell>
                                    <TableCell className="text-slate-600 py-3 font-mono text-sm">{client.phone}</TableCell>
                                    <TableCell className="text-right text-slate-500 py-3 text-sm">
                                        {new Date(client.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}