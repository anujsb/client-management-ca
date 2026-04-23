import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/api/auth/signin"); // Or your custom /login page
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Placeholder */}
            <aside className="w-64 border-r border-slate-200 bg-white hidden md:block">
                <div className="p-6 font-semibold text-lg tracking-tight text-slate-800">
                    CA Portal
                </div>
                <nav className="px-4 space-y-2">
                    {/* We will add Shadcn navigation links here later */}
                    <div className="p-2 bg-slate-100 rounded-md text-sm font-medium">Clients</div>
                    <div className="p-2 text-slate-500 hover:bg-slate-50 rounded-md text-sm">Templates</div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto">
                <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
                    <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
                    <div className="text-sm text-slate-500">
                        Welcome, {session.user?.name}
                    </div>
                </header>
                <div className="p-8 max-w-6xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}