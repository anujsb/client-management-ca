import { Search, Bell, Download, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
    return (
        <header className="h-16 bg-white border-b border-border/50 flex items-center justify-between px-8 flex-shrink-0">
            <div className="relative w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search clients, documents, or tasks..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
            </div>
            <div className="flex items-center gap-4 text-slate-500">
                <button className="hover:text-slate-900 transition"><Download className="w-5 h-5" /></button>
                <button className="hover:text-slate-900 transition relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="hover:text-slate-900 transition mr-2"><Settings className="w-5 h-5" /></button>
                <div className="h-8 w-px bg-slate-200"></div>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-slate-200 transition">
                    <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold text-sm">CA</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}