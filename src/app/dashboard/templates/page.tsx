import { getTemplatesAction } from "@/app/actions/templates";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function TemplatesPage() {
    const templates = await getTemplatesAction();

    // Separate global defaults from CA's custom templates
    const systemTemplates = templates.filter((t) => t.caId === null);
    const customTemplates = templates.filter((t) => t.caId !== null);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Message Templates
                    </h2>
                    <p className="text-slate-500">
                        Manage your WhatsApp request messages.
                    </p>
                </div>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    + Create Custom Template
                </Button>
            </div>

            {/* System Default Templates */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Standard Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemTemplates.length === 0 ? (
                        <p className="text-sm text-slate-500">No system templates found.</p>
                    ) : (
                        systemTemplates.map((template) => (
                            <Card key={template.id} className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base text-slate-900">{template.name}</CardTitle>
                                    <CardDescription className="text-xs text-blue-600 font-medium">System Default</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 line-clamp-3">{template.content}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* CA Custom Templates */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-slate-800">Your Custom Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customTemplates.length === 0 ? (
                        <div className="col-span-full p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
                            <p className="text-sm text-slate-500">You haven't created any custom templates yet.</p>
                        </div>
                    ) : (
                        customTemplates.map((template) => (
                            <Card key={template.id} className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base text-slate-900">{template.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600 line-clamp-3">{template.content}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}