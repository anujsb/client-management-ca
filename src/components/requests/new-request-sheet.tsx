"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare, User, FileText, Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { dispatchRequestAction } from "@/app/actions/requests"; // Import the Twilio action

type Client = { id: string; name: string; phone: string; gstin: string };
type Template = { id: string; name: string; content: string };

export function NewRequestSheet({
    clients,
    templates,
}: {
    clients: Client[];
    templates: Template[];
}) {
    const [open, setOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [messagePreview, setMessagePreview] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!selectedTemplateId) {
            setMessagePreview("");
            return;
        }
        const template = templates.find((t) => t.id === selectedTemplateId);
        const client = clients.find((c) => c.id === selectedClientId);

        if (template) {
            let draft = template.content;
            if (client) draft = draft.replace(/{{client_name}}/g, client.name);
            setMessagePreview(draft);
        }
    }, [selectedClientId, selectedTemplateId, clients, templates]);

    const handleDispatch = () => {
        const template = templates.find((t) => t.id === selectedTemplateId);
        if (!template) return;

        startTransition(async () => {
            try {
                await dispatchRequestAction(selectedClientId, template.name, messagePreview);
                setOpen(false);
                // Optional: Add a Shadcn toast here to show success
            } catch (error) {
                console.error("Failed to send:", error);
                alert("Failed to send message. Check Twilio configuration.");
            }
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Dispatch Request
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md w-full overflow-y-auto bg-slate-50">
                <SheetHeader className="pb-6 border-b border-slate-200">
                    <SheetTitle className="text-xl font-semibold text-slate-900">New Document Request</SheetTitle>
                    <SheetDescription className="text-slate-500">
                        Dispatch an automated WhatsApp request to a client.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" /> Client
                        </Label>
                        <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                            <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                                <SelectValue placeholder="Choose a client..." />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.name} <span className="text-slate-400 ml-1">({client.gstin})</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-700 font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" /> Workflow Template
                        </Label>
                        <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId} disabled={!selectedClientId}>
                            <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                                <SelectValue placeholder="Choose a template..." />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map((template) => (
                                    <SelectItem key={template.id} value={template.id}>
                                        {template.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-slate-700 font-medium">Message Preview</Label>
                        <div className="relative">
                            <Textarea
                                className="min-h-[220px] bg-white border-slate-200 shadow-sm resize-none text-sm p-4 text-slate-700 focus-visible:ring-indigo-500"
                                value={messagePreview}
                                onChange={(e) => setMessagePreview(e.target.value)}
                                placeholder="Message preview will appear here..."
                                disabled={!selectedTemplateId || isPending}
                            />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            This exact text will be sent to the client via WhatsApp. The AI will use this context to verify incoming documents.
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-auto">
                    <Button
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center justify-center gap-2 h-11"
                        onClick={handleDispatch}
                        disabled={!selectedClientId || !selectedTemplateId || !messagePreview || isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Dispatching...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> Send via WhatsApp
                            </>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}