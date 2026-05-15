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
        <div className="p-8 max-w-7xl mx-auto space-y-16 py-12">
            {/* Hero Welcome */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-zinc-900 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles size={18} fill="currentColor" />
                        <span className="text-xs font-black uppercase tracking-widest italic">Engine Status: Optimal</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] font-display"
                    >
                        Welcome, <span className="text-primary italic">Designer</span>
                    </motion.h1>
                    <p className="text-xl text-zinc-500 font-bold tracking-tight uppercase max-w-xl">
                        Focus. Iterate. Build. Your neural workspace is synchronized and ready for the next evolution.
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
                    className="brutal-btn-primary h-16 px-10 text-xl font-display group translate-y-4"
                >
                    <Plus className="w-8 h-8 stroke-[3px]" />
                    Create Manifest
                </Button>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Active Flux" value={insights?.totalNotes || 0} icon={FileText} trend="+12.4%" />
                <StatsCard title="Neural Activity" value={
                    insights?.weeklyActivity?.reduce(
                        (acc, curr) =>
                            acc + curr.count,
                        0
                    ) || 0
                } icon={TrendingUp} trend="+5.2%" color="secondary" />
                <StatsCard title="Sync Streak" value={insights?.aiUsageCount || 0} icon={Zap} unit="cycles" trend="BURST" color="accent" />
                <StatsCard title="AI Inference" value="1.2k" icon={Sparkles} trend="PEAK" color="ai" />
            </section>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left: Recent Activity */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black tracking-tight uppercase font-display italic">
                            Recent Manifests
                        </h2>
                        <Link href="/notes" className="text-zinc-500 hover:text-primary font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 group">
                            Explore All <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {notes.slice(0, 4).map((note, index) => (
                            <NoteCard key={note.id} note={note} index={index} />
                        ))}
                    </div>
                </div>

                {/* Right: Insights & AI */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight uppercase font-display border-l-4 border-primary pl-4">Cognitive Heatmap</h2>
                        <div className="brutal-card bg-zinc-900/30 h-64 flex flex-col p-4">
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <BarChart data={dynamicChartData}>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#52525b', fontSize: 10, fontWeight: '900' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#09090b', border: '2px solid #27272a', borderRadius: '12px', padding: '8px' }}
                                        itemStyle={{ color: '#FAFAFA', fontWeight: '900', fontSize: '12px' }}
                                    />
                                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                        {dynamicChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === dynamicChartData.length - 1 ? '#FACC15' : '#18181b'} stroke={index === dynamicChartData.length - 1 ? '#000' : '#27272a'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight uppercase font-display border-l-4 border-secondary pl-4">Priority Nodes</h2>
                            <Sparkles size={18} className="text-secondary animate-pulse" />
                        </div>
                        <div className="brutal-card bg-primary text-black border-4 border-black p-6 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            {insights?.mostUsedTags.map((tagData, i) => (
                                <div
                                    key={tagData.tag}
                                    className="flex items-center justify-between group border-b border-black/10 pb-2 last:border-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-black/40">
                                            [{i + 1}]
                                        </span>

                                        <span className="font-black group-hover:italic transition-all cursor-pointer uppercase text-sm tracking-tight">
                                            {tagData.tag}
                                        </span>
                                    </div>

                                    <span className="text-[10px] font-black uppercase text-black/60">
                                        {tagData.count} Cycles
                                    </span>
                                </div>
                            ))}
                        </div>
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
        primary: "text-primary border-primary bg-primary/5",
        secondary: "text-secondary border-secondary bg-secondary/5",
        accent: "text-accent border-accent bg-accent/5",
        ai: "text-ai border-ai bg-ai/5"
    };

    const borderCol = {
        primary: "border-primary",
        secondary: "border-secondary",
        accent: "border-accent",
        ai: "border-ai"
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="brutal-card bg-zinc-900/20 border-black p-6 flex flex-col gap-6 relative group overflow-hidden"
        >
            <div className="flex justify-between items-start z-10">
                <div className={cn("p-2 rounded-lg border-2", borderCol[color], colorMap[color])}>
                    <Icon className="w-5 h-5" strokeWidth={3} />
                </div>
                <div className="text-[10px] font-black px-2 py-1 bg-black rounded-md border border-zinc-800 text-zinc-400">
                    {trend}
                </div>
            </div>
            <div className="z-10">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter italic font-display">{value}</span>
                    {unit && <span className="text-[10px] font-black text-zinc-500 uppercase italic tracking-widest">{unit}</span>}
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-2 mt-2 block">{title}</span>
            </div>
            <div className={cn("absolute -bottom-4 -right-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full",
                color === 'primary' ? 'bg-primary' : color === 'secondary' ? 'bg-secondary' : 'bg-accent')} />
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
                <div className="brutal-card bg-zinc-900/40 border-zinc-900 hover:border-primary/50 h-52 flex flex-col justify-between group-hover:bg-zinc-900 transition-all shadow-none hover:shadow-[4px_4px_0px_0px_#FACC15]">
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{note.updatedAt
                                ? new Date(
                                    note.updatedAt
                                ).toLocaleDateString()
                                : "Unknown"}</span>
                            <div className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-md">
                                <Clock size={12} className="text-zinc-600 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black line-clamp-1 group-hover:italic transition-all font-display uppercase tracking-tight">{note.title || "Manifest Draft"}</h3>
                        <p className="text-sm text-zinc-500 line-clamp-2 font-medium leading-relaxed italic">
                            {note.content.replace(/#+\s/g, '').substring(0, 100) || "No neural data extracted yet..."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-zinc-900/50">
                        {note.tags
                            .slice(0, 3)
                            .map((tag) => (
                                <Badge
                                    key={tag}
                                    className="border border-zinc-800 bg-zinc-950 text-[9px] font-black uppercase tracking-tighter text-zinc-400 group-hover:border-zinc-700"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        <div className="ml-auto flex items-center gap-1 group-hover:text-primary transition-colors">
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all font-black" />
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
