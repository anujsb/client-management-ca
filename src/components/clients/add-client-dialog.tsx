"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { addClientAction } from "@/app/actions/clients";

export function AddClientDialog() {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        setError(null);
        try {
            await addClientAction(formData);
            setOpen(false);
        } catch (err: any) {
            setError(err.message || "Failed to add client");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    + New Client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <form action={clientAction} className="space-y-4 mt-4">
                    {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}

                    <div className="space-y-2">
                        <Label htmlFor="name">Business / Client Name</Label>
                        <Input id="name" name="name" required placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input id="gstin" name="gstin" required placeholder="22AAAAA0000A1Z5" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">WhatsApp Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            required
                            placeholder="+919876543210"
                            pattern="^\+[1-9]\d{1,14}$"
                            title="Must include country code (e.g., +91) followed by the number"
                        />
                        <p className="text-xs text-slate-500">Must include country code (e.g., +91)</p>
                    </div>
                    <Button type="submit" className="w-full bg-slate-900">
                        Save Client
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}