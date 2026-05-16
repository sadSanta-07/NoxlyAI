"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Plus, TrendingUp, FileText } from "lucide-react";
import { api, Note } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/component/ui/badge";
import { Button } from "@/component/ui/button";
import { StatsSection } from "@/component/dashboard/StatsSection";
import { ActivitySection } from "@/component/dashboard/ActivitySection";
import { RecentNotesSection } from "@/component/dashboard/RecentNotesSection";

type Insights = {
    totalNotes: number;
    recentNotes: Pick<Note, "id" | "title" | "updatedAt" | "tags">[];
    mostUsedTags: { tag: string; count: number }[];
    aiUsageCount: number;
    weeklyActivity: { date: string; count: number }[];
};

export function Dashboard() {
    const { user } = useAuthStore();
    const [notes, setNotes] = useState<Note[]>([]);
    const [insights, setInsights] = useState<Insights | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notesRes, insightsRes] = await Promise.all([
                    api.getNotes(),
                    api.getInsights(),
                ]);
                setNotes(notesRes.data);
                setInsights(insightsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 py-12">
            {/* Hero Welcome */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles size={16} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Productivity Dashboard</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display"
                    >
                        Welcome, <span className="text-primary italic">{user?.name || "User"}</span>
                    </motion.h1>
                    <p className="text-zinc-500 font-medium tracking-tight uppercase text-sm font-display">
                        Manage your notes, track activity, and leverage AI insights.
                    </p>
                </div>
                <Button
                    onClick={async () => {
                        const res = await api.createNote({
                            title: "Untitled Note",
                            content: "",
                        });
                        router.push(`/notes/${res.data.id}`);
                    }}
                    className="brutal-btn-primary h-14 px-8 text-lg font-display group"
                >
                    <Plus className="w-6 h-6 stroke-[3px]" />
                    New Note
                </Button>
            </section>

            {/* Stats Grid */}
            <StatsSection insights={insights} />

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Activity & Notes */}
                <div className="lg:col-span-8 space-y-10">
                    <ActivitySection insights={insights} />
                    <RecentNotesSection notes={notes} />
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase font-display border-l-4 border-primary pl-4">Most Used Tags</h2>
                        <div className="brutal-card bg-zinc-900/80 p-6 space-y-4 rounded-[2rem] border-zinc-800 shadow-xl">
                            {insights?.mostUsedTags?.length ? (
                                insights.mostUsedTags.map((tagData, i) => (
                                    <div
                                        key={tagData.tag}
                                        className="flex items-center justify-between group border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-zinc-600">
                                                #{i + 1}
                                            </span>
                                            <span className="font-black uppercase text-xs tracking-tight text-zinc-300">
                                                {tagData.tag}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black">
                                            {tagData.count} NOTES
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] font-black text-zinc-600 uppercase italic text-center py-8">No tags used yet</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] space-y-4 shadow-xl border-none">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-4">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <h3 className="text-black font-black text-2xl uppercase font-display leading-tight">Pro Features Active</h3>
                        <p className="text-black/70 text-xs font-bold uppercase leading-relaxed font-display">
                            Your workspace is boosted with high-priority AI processing and cloud synchronization.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="h-20 bg-zinc-900 animate-pulse rounded-2xl w-1/2 mb-8" />
            <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-zinc-900 animate-pulse rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                    <div className="h-10 bg-zinc-900 animate-pulse rounded-xl w-1/4" />
                    <div className="grid grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-zinc-900 animate-pulse rounded-2xl" />)}
                    </div>
                </div>
                <div className="h-[500px] bg-zinc-900 animate-pulse rounded-2xl" />
            </div>
        </div>
    );
}
