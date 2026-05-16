"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import {
    FileText,
    TrendingUp,
    Zap,
    ArrowUpRight,
    Clock,
    Sparkles,
    Plus,
} from "lucide-react";

import {
    api,
    Note,
} from "@/lib/api";

import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/component/ui/badge";

import { Button } from "@/component/ui/button";

import { cn } from "@/lib/utils";

import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

type Insights = {
    totalNotes: number;

    recentNotes: Pick<
        Note,
        "id" |
        "title" |
        "updatedAt" |
        "tags"
    >[];

    mostUsedTags: {
        tag: string;
        count: number;
    }[];

    aiUsageCount: number;

    weeklyActivity: {
        date: string;
        count: number;
    }[];
};

export function Dashboard() {
    const { user } = useAuthStore();
    const [notes, setNotes] = useState<Note[]>([]);
    const [insights, setInsights] = useState<Insights | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {
        const fetchData =
            async () => {
                try {
                    const [
                        notesRes,
                        insightsRes,
                    ] =
                        await Promise.all([
                            api.getNotes(),
                            api.getInsights(),
                        ]);

                    setNotes(notesRes.data);

                    setInsights(
                        insightsRes.data
                    );
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

        fetchData();
    }, []);

    const dynamicChartData = insights?.weeklyActivity.map(item => ({
        day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: item.count
    })) || [
        { day: "Mon", value: 0 },
        { day: "Tue", value: 0 },
        { day: "Wed", value: 0 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 0 },
        { day: "Sat", value: 0 },
        { day: "Sun", value: 0 },
    ];

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
                        const res =
                            await api.createNote({
                                title: "Untitled Note",
                                content: "",
                            });

                        router.push(
                            `/notes/${res.data.id}`
                        );
                    }}
                    className="brutal-btn-primary h-14 px-8 text-lg font-display group"
                >
                    <Plus className="w-6 h-6 stroke-[3px]" />
                    New Note
                </Button>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Notes" value={insights?.totalNotes || 0} icon={FileText} trend="Total" />
                <StatsCard title="Weekly Activity" value={
                    insights?.weeklyActivity?.reduce(
                        (acc, curr) =>
                            acc + curr.count,
                        0
                    ) || 0
                } icon={TrendingUp} trend="Weekly" color="secondary" />
                <StatsCard title="AI Usage" value={insights?.aiUsageCount || 0} icon={Zap} unit="Requests" trend="AI" color="accent" />
                <StatsCard title="Total Tags" value={insights?.mostUsedTags.length || 0} icon={Sparkles} trend="Tags" color="ai" />
            </section>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Activity & Notes */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase font-display flex items-center gap-3">
                            <TrendingUp size={20} className="text-primary" /> Weekly Activity Summary
                        </h2>
                        <div className="brutal-card bg-zinc-900/60 h-72 flex flex-col p-6 rounded-[2rem] border-zinc-800 shadow-xl">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dynamicChartData}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#71717a', fontSize: 10, fontWeight: '900' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', padding: '12px' }}
                                        itemStyle={{ color: '#FAFAFA', fontWeight: '900', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {dynamicChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === dynamicChartData.length - 1 ? '#FACC15' : '#27272a'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight uppercase font-display flex items-center gap-3">
                                <FileText size={20} className="text-primary" /> Recently Edited
                            </h2>
                            <Link href="/notes" className="text-zinc-500 hover:text-primary font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 group">
                                View All <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {notes.slice(0, 4).map((note, index) => (
                                <NoteCard key={note.id} note={note} index={index} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Tags Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase font-display border-l-4 border-primary pl-4">Most Used Tags</h2>
                        <div className="brutal-card bg-zinc-900/80 p-6 space-y-4 rounded-[2rem] border-zinc-800 shadow-xl">
                            {insights?.mostUsedTags.length ? (
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

function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color = "primary",
    unit = "",
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend: string;
    color?:
    | "primary"
    | "secondary"
    | "accent"
    | "ai";
    unit?: string;
}) {
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

function NoteCard({ note, index }: { note: Note; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link href={`/notes/${note.id}`} className="block group">
                <div className="brutal-card bg-zinc-900/80 border-zinc-800 hover:border-primary/50 h-52 flex flex-col justify-between group-hover:bg-zinc-900 transition-all rounded-[2rem] p-6 shadow-xl">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start font-display">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{note.updatedAt
                                ? new Date(
                                    note.updatedAt
                                ).toLocaleDateString()
                                : "Just Now"}</span>
                            <div className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg">
                                <Clock size={12} className="text-zinc-600 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black line-clamp-1 font-display uppercase tracking-tight text-zinc-100 group-hover:text-primary transition-colors">{note.title || "Untitled Note"}</h3>
                        <p className="text-xs text-zinc-500 line-clamp-2 font-medium leading-relaxed italic font-display">
                            {note.content.replace(/#+\s/g, '').substring(0, 100) || "Start writing your masterpiece..."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50 font-display">
                        {note.tags && note.tags.length > 0 ? (
                            note.tags.slice(0, 2).map((tag) => (
                                    <Badge
                                    key={tag}
                                    className="border border-zinc-700 bg-zinc-950 text-[8px] font-black uppercase tracking-tighter text-zinc-300 font-display"
                                >
                                    #{tag}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-[8px] font-black text-zinc-700 uppercase italic font-display">No Tags</span>
                        )}
                        <div className="ml-auto flex items-center gap-1 text-zinc-600 group-hover:text-primary transition-colors">
                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
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
