"use client";

import {
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import {
    api,
    Note,
} from "@/lib/api";

import ReactMarkdown from "react-markdown";

import {
    Globe,
    Clock,
    User,
    Zap,
    ArrowLeft,
    ArrowRight,
} from "lucide-react";

import { Badge } from "@/component/ui/badge";

import { Skeleton } from "@/component/ui/skeleton";

export function PublicShare() {
    const params = useParams();

    const shareId =
        params.shareId as string;
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchShared = async () => {
            try {
                if (shareId) {
                    const res =
                        await api.getSharedNote(
                            shareId
                        );

                    setNote(res.data);
                }
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchShared();
    }, [shareId]);

    if (loading) return <PublicShareSkeleton />;
    if (error || !note) return <PublicShareError />;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-primary selection:text-black font-sans relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ai/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)] opacity-[0.02] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-24 md:py-40 relative z-10">

                {/* Editorial Header */}
                <header className="mb-24 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="flex flex-wrap items-center gap-6 text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px] font-display">
                        <span className="flex items-center gap-2 border border-zinc-800 px-3 py-1.5 rounded-xl bg-zinc-900/50"><Globe size={12} className="text-primary" /> Public Note</span>
                        <span className="flex items-center gap-2"><Clock size={12} /> {note.updatedAt
                            ? new Date(
                                note.updatedAt
                            ).toLocaleDateString()
                            : "Just Now"}</span>
                        <span className="flex items-center gap-2"><User size={12} />Created by: {
                            (note as Note & {
                                user?: {
                                    name?: string;
                                };
                            })?.user?.name ||
                            "Noxly User"
                        }</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-white font-display">
                        {note.title}
                    </h1>

                    <div className="flex flex-wrap gap-3">
                        {note.tags.map((tag) => (
                            <Badge key={tag} className="bg-zinc-900 text-zinc-400 border border-zinc-800 font-black uppercase text-[10px] tracking-widest rounded-xl py-1.5 px-5">
                                #{tag}
                            </Badge>
                        ))}
                    </div>

                    {/* AI Summary Block - Editorial style */}
                    <div className="bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800/50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap className="w-24 h-24 md:w-48 md:h-48 text-primary" strokeWidth={1} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2 text-primary font-display">
                            <Zap size={14} fill="currentColor" /> AI Insight
                        </h3>
                        <p className="text-lg md:text-2xl font-bold text-zinc-300 relative z-10 leading-tight italic font-display">
                            &ldquo;
                            {note.summary || `A focused exploration of ${note.title.toLowerCase()}, captured and organized with Noxly AI.`}
                            &rdquo;
                        </p>
                    </div>
                </header>

                {/* Content Area */}
                <main className="prose prose-invert prose-p:text-zinc-400 prose-p:font-bold prose-p:leading-relaxed prose-p:text-xl max-w-none prose-headings:text-zinc-100 prose-headings:font-black prose-headings:italic prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-[2.5rem] prose-hr:border-zinc-900 prose-a:text-primary mb-40 animate-in fade-in duration-1000 delay-500">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                </main>

                {/* Footer CTA */}
                <footer className="border-t border-zinc-900 pt-20 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-3">
                        <h4 className="text-3xl font-black uppercase tracking-tighter font-display">BUILT WITH <span className="text-primary italic">NOXLY AI</span></h4>
                        <p className="font-black text-zinc-600 uppercase tracking-widest text-[10px] font-display">The professional workspace for organized thinkers.</p>
                    </div>
                    <Link href="/auth" className="brutal-btn-primary h-18 px-12 text-sm shadow-none hover:shadow-primary/20 transition-all font-display">
                        <span className="text-xl">GET STARTED</span> <ArrowRight size={24} className="stroke-[3.3px] ml-4" />
                    </Link>
                </footer>
            </div>
        </div>
    );
}

function PublicShareSkeleton() {
    return (
        <div className="min-h-screen bg-[#050505] p-20 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-12">
                <Skeleton className="h-6 w-1/3 bg-zinc-900 rounded-full" />
                <Skeleton className="h-32 w-full bg-zinc-900 rounded-2xl" />
                <Skeleton className="h-40 w-full bg-zinc-900 rounded-2xl border-4 border-zinc-800" />
                <div className="space-y-4 pt-10">
                    <Skeleton className="h-6 w-full bg-zinc-900" />
                    <Skeleton className="h-6 w-full bg-zinc-900" />
                    <Skeleton className="h-6 w-2/3 bg-zinc-900" />
                </div>
            </div>
        </div>
    );
}

function PublicShareError() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-8">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl">
                    <Zap size={40} className="text-primary" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter font-display text-zinc-100">Note not found</h2>
                    <p className="font-black text-zinc-500 uppercase tracking-widest text-[10px] font-display">
                        This note might be private or it does not exist anymore.
                    </p>
                </div>
                <Link href="/" className="brutal-btn-primary h-14 w-full flex items-center justify-center gap-2 font-display">
                    <ArrowLeft size={18} className="stroke-[3px]" /> GO TO NOXLY
                </Link>
            </div>
        </div>
    );
}
