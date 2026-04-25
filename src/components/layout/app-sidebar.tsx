import {
    LayoutDashboard, Users, MessageSquare, Inbox, FileText,
    Moon, HelpCircle, Zap
} from "lucide-react";
import Link from "next/link";

// Extracted NavItem helper
function NavItem({ icon, label, active, badge, href = "#" }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, href?: string }) {
    return (
        <Link href={href} className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-orange-50 text-orange-600 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <div className="flex items-center gap-3">
                {icon && <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>}
                <span className="text-sm">{label}</span>
            </div>
            {badge && <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        </Link>
    );
}

export function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-border flex flex-col justify-between shrink-0 h-full">
            <div>
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-500 p-1.5 rounded-md">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 tracking-tight">DocuAgent CA</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="px-4 py-6 space-y-1">
                    <p className="px-2 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Main Menu</p>
                    <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Dashboard Overview" active />
                    <NavItem href="/dashboard/clients" icon={<Users />} label="Client Management" />
                    <NavItem href="/dashboard/agent" icon={<MessageSquare />} label="AI WhatsApp Agent" />
                    <NavItem href="/dashboard/inbox" icon={<Inbox />} label="Document Inbox" badge="12" />
                    <NavItem href="/dashboard/details" icon={<FileText />} label="Client Detail" />
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-4 pb-6 space-y-4">
                <div className="space-y-1">
                    <NavItem icon={<Moon />} label="Dark Mode" />
                    <NavItem icon={<HelpCircle />} label="Help & Support" />
                </div>

                {/* Upgrade Card */}
                <div className="bg-slate-900 rounded-xl p-4 text-white">
                    <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center mb-3">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Get detailed analytics</h4>
                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">Upgrade to Pro for advanced reporting.</p>
                    <button className="w-full bg-white text-slate-900 text-sm font-medium py-2 rounded-lg hover:bg-slate-100 transition">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
}