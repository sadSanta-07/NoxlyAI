"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend: string;
    color?: "primary" | "secondary" | "accent" | "ai";
    unit?: string;
}

function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color = "primary",
    unit = "",
}: StatsCardProps) {
    const colorMap = {
        primary: "text-primary bg-primary/10",
        secondary: "text-secondary bg-secondary/10",
        accent: "text-accent bg-accent/10",
        ai: "text-ai bg-ai/10"
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="brutal-card bg-zinc-900/80 border-zinc-800 p-6 flex flex-col gap-4 relative group overflow-hidden rounded-[2rem] shadow-xl"
        >
            <div className="flex justify-between items-center z-10">
                <div className={cn("p-2.5 rounded-xl", colorMap[color])}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="text-[10px] font-black px-2.5 py-1 bg-zinc-950 rounded-full border border-zinc-800 text-zinc-400 uppercase tracking-widest font-display">
                    {trend}
                </div>
            </div>
            <div className="z-10 mt-2">
                <div className="flex items-baseline gap-1.5 font-display">
                    <span className="text-5xl font-black tracking-tighter text-zinc-100">{value}</span>
                    {unit && <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{unit}</span>}
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1 block font-display">{title}</span>
            </div>
        </motion.div>
    );
}

export function StatsSection({ insights }: { insights: any }) {
    const weeklyTotal = Array.isArray(insights?.weeklyActivity)
        ? insights.weeklyActivity.reduce((acc: number, curr: any) => acc + curr.count, 0)
        : 0;

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Notes" value={insights?.totalNotes || 0} icon={FileText} trend="Total" />
            <StatsCard title="Weekly Activity" value={weeklyTotal} icon={TrendingUp} trend="Weekly" color="secondary" />
            <StatsCard title="AI Usage" value={insights?.aiUsageCount || 0} icon={Zap} unit="Requests" trend="AI" color="accent" />
            <StatsCard title="Total Tags" value={insights?.mostUsedTags?.length || 0} icon={Sparkles} trend="Tags" color="ai" />
        </section>
    );
}
