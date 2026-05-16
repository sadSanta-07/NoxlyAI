"use client";

import { Sparkles, RefreshCcw, Edit3, Eye, MoreHorizontal, Globe, Lock, Share2 } from "lucide-react";
import { Button } from "@/component/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/component/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Note } from "@/lib/api";

interface NoteEditorHeaderProps {
    title: string;
    setTitle: (title: string) => void;
    mode: "edit" | "preview";
    setMode: (mode: "edit" | "preview") => void;
    isGeneratingTitle: boolean;
    handleSuggestTitle: () => void;
    note: Note;
    onUpdate: (data: Partial<Note>) => void;
}

export function NoteEditorHeader({
    title,
    setTitle,
    mode,
    setMode,
    isGeneratingTitle,
    handleSuggestTitle,
    note,
    onUpdate
}: NoteEditorHeaderProps) {
    return (
        <div className="px-6 md:px-12 pt-16 pb-12 border-b border-zinc-900 bg-zinc-950/20">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="flex-1 relative group">
                        <textarea
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={cn(
                                "w-full bg-transparent font-black tracking-tighter uppercase focus:outline-none placeholder:text-zinc-900 leading-[0.85] resize-none h-auto min-h-[1em] py-2 overflow-hidden font-display transition-all focus:placeholder:opacity-0",
                                title.length > 40 ? "text-2xl sm:text-3xl md:text-5xl" : 
                                title.length > 20 ? "text-3xl sm:text-4xl md:text-6xl" : 
                                "text-4xl sm:text-5xl md:text-8xl"
                            )}
                            placeholder="NOTE TITLE"
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                        <button
                            onClick={handleSuggestTitle}
                            disabled={isGeneratingTitle}
                            className="absolute -left-10 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary hover:scale-110 disabled:animate-spin"
                        >
                            {isGeneratingTitle ? <RefreshCcw size={18} /> : <Sparkles size={18} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 pb-4">
                        <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 shadow-2xl backdrop-blur-3xl">
                            <button
                                onClick={() => setMode("edit")}
                                className={`px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black transition-all uppercase tracking-widest ${mode === "edit" ? "bg-zinc-800 text-primary border border-zinc-700 shadow-xl" : "text-zinc-500 hover:text-zinc-300"}`}
                            >
                                <Edit3 size={14} /> Design
                            </button>
                            <button
                                onClick={() => setMode("preview")}
                                className={`px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black transition-all uppercase tracking-widest ${mode === "preview" ? "bg-zinc-800 text-primary border border-zinc-700 shadow-xl" : "text-zinc-500 hover:text-zinc-300"}`}
                            >
                                <Eye size={14} /> Reveal
                            </button>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-10 h-10 border border-zinc-800 rounded-xl bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors focus:outline-none group">
                                <MoreHorizontal size={18} className="text-zinc-500 group-hover:text-zinc-300" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl">
                                <DropdownMenuItem
                                    onClick={() => onUpdate({ isPublic: !note.isPublic })}
                                    className="rounded-xl focus:bg-zinc-800 focus:text-primary font-black uppercase text-[10px] p-3 flex items-center justify-between transition-colors font-display"
                                >
                                    <span>Public Access</span>
                                    {note.isPublic ? <Globe size={14} className="text-secondary" /> : <Lock size={14} className="text-zinc-600" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        const url = `${window.location.origin}/share/${note.shareId}`;
                                        navigator.clipboard.writeText(url);
                                        toast.success("Share link copied!");
                                    }}
                                    disabled={!note.isPublic}
                                    className="rounded-xl focus:bg-zinc-800 focus:text-primary font-black uppercase text-[10px] p-3 flex items-center justify-between transition-colors font-display"
                                >
                                    <span>Share Link</span>
                                    <Share2 size={14} />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-zinc-800" />
                                <DropdownMenuItem
                                    onClick={() => onUpdate({ isArchived: !note.isArchived })}
                                    className="rounded-xl focus:bg-destructive/10 focus:text-destructive font-black uppercase text-[10px] p-3 flex items-center justify-between transition-colors text-destructive/80 font-display"
                                >
                                    {note.isArchived ? "Restore Note" : "Archive Note"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}
