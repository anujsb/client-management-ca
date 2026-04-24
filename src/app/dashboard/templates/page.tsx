'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Copy, MessageSquare } from 'lucide-react';

export default function TemplatesPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Request Templates</h1>
                    <p className="text-slate-600 mt-1">Create and manage reusable message templates for quick requests.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Template
                </Button>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Template Card 1 */}
                <Card className="border-gray-200 bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit2 className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Bank Statements Request</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Hi {"{{ client_name }}"}, we need your bank statements for {"{{ month }}"}. Please share the documents at your earliest convenience.</p>
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Use Template
                        </Button>
                    </div>
                </Card>

                {/* Template Card 2 */}
                <Card className="border-gray-200 bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit2 className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">GST Returns Request</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Hi {"{{ client_name }}"}, please share your GST returns (FORM GSTR-1 & GSTR-3B) for {"{{ month }}"}. This is urgent for our audit compliance.</p>
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Use Template
                        </Button>
                    </div>
                </Card>

                {/* Template Card 3 */}
                <Card className="border-gray-200 bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit2 className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Invoice Register Request</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Hi {"{{ client_name }}"}, we need your complete invoice register for the month of {"{{ month }}"}. Please provide details of all invoices issued.</p>
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Use Template
                        </Button>
                    </div>
                </Card>

                {/* Template Card 4 */}
                <Card className="border-gray-200 bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit2 className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">TDS Certificate Request</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Hi {"{{ client_name }}"}, we request TDS certificates from all your vendors for the financial year. Please consolidate and share.</p>
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Use Template
                        </Button>
                    </div>
                </Card>

                {/* Template Card 5 */}
                <Card className="border-gray-200 bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-pink-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-pink-600" />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit2 className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Follow-up Reminder</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Hi {"{{ client_name }}"}, this is a gentle reminder for the documents we requested earlier. Please share them at your earliest convenience.</p>
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Use Template
                        </Button>
                    </div>
                </Card>

                {/* Template Card 6 */}
                <Card className="border-gray-200 bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit2 className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Compliance Checklist</h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">Hi {"{{ client_name }}"}, attached is our compliance checklist for {"{{ month }}"}. Please review and share all required documents marked as pending.</p>
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 border-gray-300">
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                        </Button>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Use Template
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
