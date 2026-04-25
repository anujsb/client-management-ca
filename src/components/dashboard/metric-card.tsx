import React from "react";
import { LucideIcon, Activity } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: string;
    isPositive?: boolean;
    description?: string;
    color?: "indigo" | "emerald" | "orange" | "blue" | "rose";
}

const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
};

export function MetricCard({ 
    title, 
    value, 
    icon: Icon = Activity, 
    trend, 
    isPositive = true, 
    description, 
    color = "indigo" 
}: MetricCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isPositive 
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
                        : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                    }`}>
                        {isPositive ? "↑" : "↓"} {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</h3>
                {description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{description}</p>
                )}
            </div>
        </div>
    );
}
