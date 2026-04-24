import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, Maximize } from "lucide-react";

export function DocumentViewer({ documentUrl }: { documentUrl: string | null }) {
    // 1. REAL FUNCTIONALITY: Image transformation state
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation(prev => prev + 90);

    return (
        <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900/50 p-6">

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-t-xl p-3 flex justify-between items-center shadow-sm z-10 relative">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-2">document_scan.jpg</span>
                <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-900">
                    <button onClick={handleZoomOut} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-500 transition"><ZoomOut className="w-4 h-4" /></button>
                    <span className="text-xs font-medium w-12 text-center text-slate-600">{Math.round(zoom * 100)}%</span>
                    <button onClick={handleZoomIn} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-500 transition"><ZoomIn className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button onClick={handleRotate} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-500 transition"><RotateCw className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Image Canvas with hidden overflow for zoom */}
            <div className="flex-1 bg-white dark:bg-slate-950 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-xl overflow-hidden relative flex items-center justify-center shadow-sm">
                {documentUrl ? (
                    <img
                        src={documentUrl}
                        alt="Client Document"
                        className="transition-transform duration-200 ease-in-out object-contain max-h-full max-w-full"
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`
                        }}
                    />
                ) : (
                    <div className="text-slate-400 text-sm">No document image available</div>
                )}
            </div>
        </div>
    );
}