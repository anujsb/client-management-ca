"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewRequestSheet } from "@/components/requests/new-request-sheet";

export function ClientDataTable({ clientsData, templates }: { clientsData: any[], templates: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const filteredClients = clientsData.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.gstin && client.gstin.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Client Directory</h3>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80 border-b border-slate-200 dark:border-slate-800">
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 pl-6">Client Name</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">Entity Type</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">Last Contact</TableHead>
                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">Tags</TableHead>
                            <TableHead className="w-24 text-right py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No clients found matching "{searchQuery}"</TableCell></TableRow>
                        ) : filteredClients.map((client) => (
                            <TableRow
                                key={client.id}
                                onClick={() => router.push(`/dashboard/details?id=${client.id}`)}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/50 transition-colors group cursor-pointer"
                            >
                                <TableCell className="py-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9 border border-slate-100 dark:border-slate-800 group-hover:border-orange-200 transition">
                                            <AvatarFallback className="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 text-xs font-bold">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-orange-600 transition">{client.name}</p>
                                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">GST: {client.gstin || "N/A"}</p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="text-sm text-slate-600 dark:text-slate-400 py-4">
                                    {client.name.toLowerCase().includes('llc') || client.name.toLowerCase().includes('inc') ? 'Corporate' : 'Individual'}
                                </TableCell>

                                <TableCell className="py-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                    ${client.globalStatus === 'Received' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}
                    ${client.globalStatus === 'Chasing' ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' : ''}
                    ${client.globalStatus === 'Flagged' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                    ${client.globalStatus === 'Pending' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : ''}
                  `}>
                                        <div className={`w-1.5 h-1.5 rounded-full 
                      ${client.globalStatus === 'Received' ? 'bg-emerald-500' : ''}
                      ${client.globalStatus === 'Chasing' ? 'bg-orange-500' : ''}
                      ${client.globalStatus === 'Flagged' ? 'bg-red-500' : ''}
                      ${client.globalStatus === 'Pending' ? 'bg-slate-400' : ''}
                    `}></div>
                                        {client.globalStatus}
                                    </div>
                                </TableCell>

                                <TableCell className="py-4">
                                    {client.lastContactDate ? (
                                        <div>
                                            <p className="text-sm text-slate-900 dark:text-slate-200">{client.lastContactDate}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">via WhatsApp</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500">-</p>
                                    )}
                                </TableCell>

                                <TableCell className="py-4">
                                    <div className="flex gap-1.5">
                                        {client.globalStatus === 'Chasing' && <Badge className="bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border-none text-[10px] font-medium px-2 py-0.5">AI Active</Badge>}
                                        {client.globalStatus === 'Flagged' && <Badge className="bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-none text-[10px] font-medium px-2 py-0.5">Action Req</Badge>}
                                    </div>
                                </TableCell>

                                {/* Stop propagation so clicking the button doesn't trigger the row click */}
                                <TableCell className="text-right py-4 pr-6" onClick={(e) => e.stopPropagation()}>
                                    <NewRequestSheet
                                        clients={[client]}
                                        templates={templates}
                                        customTrigger={
                                            <button className="text-[10px] font-medium bg-orange-50 text-orange-600 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition border border-orange-200">
                                                Send MSG
                                            </button>
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}