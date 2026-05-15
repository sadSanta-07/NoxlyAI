"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { motion } from "framer-motion";

import { Note } from "@/lib/api";

import { Button } from "@/component/ui/button";

import { Input } from "@/component/ui/input";

import { ScrollArea } from "@/component/ui/scroll-area";

import {
    Plus,
    Search,
    Trash2,
    Calendar,
    FileText,
    Globe,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface NoteListProps {
    notes: Note[];
    activeId?: string;
    onDelete: (id: string) => void;
    onAdd: () => void;
}

export function NoteList({ notes, activeId, onDelete, onAdd }: NoteListProps) {
    const [filter, setFilter] = useState("");
    const pathname = usePathname();

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.content.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            <div className="p-8 border-b border-zinc-900 bg-zinc-950/20">
                <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic font-display">
                            {pathname.startsWith("/archive") ? "The Vault" : pathname.startsWith("/shared") ? "Public Hub" : "Manifests"}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                            {pathname.startsWith("/shared") ? "Public Clusters" : "Neural Clusters"}: {notes.length}
                        </p>
                    <Button onClick={onAdd} size="icon" className="w-10 h-10 rounded-xl brutal-btn-primary p-0 rotate-3 hover:rotate-0 transition-transform">
                        <Plus size={20} className="stroke-[3px]" />
                    </Button>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="FILTER NODES..."
                        className="pl-10 bg-zinc-900/50 border border-zinc-800 rounded-xl h-12 text-xs font-black uppercase tracking-widest focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="py-6 space-y-1.5">
                    {filteredNotes.map((note, i) => {
                        const isActive = activeId === note.id;
                        const basePath = pathname.startsWith("/archive") ? "/archive" : pathname.startsWith("/shared") ? "/shared" : "/notes";
                        return (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="group relative"
                            >
                                <Link href={`${basePath}/${note.id}`}>                  <div className={cn(
                                    "p-4 rounded-xl transition-all block text-left relative overflow-hidden",
                                    isActive
                                        ? "bg-zinc-900 border border-zinc-800 shadow-xl"
                                        : "border border-transparent hover:bg-zinc-900/50 hover:border-zinc-800"
                                )}>
                                    {isActive && (
                                        <motion.div layoutId="list-active-pill" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
                                    )}
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText size={14} className={isActive ? "text-primary" : "text-zinc-700"} strokeWidth={3} />
                                        <h3 className={cn(
                                            "font-black truncate text-xs flex-1 uppercase tracking-wider",
                                            isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                        )}>
                                            {note.title || "UNTITLED MANIFEST"}
                                        </h3>
                                    </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                                                <Calendar size={10} />
                                                {note.updatedAt
                                                    ? new Date(
                                                        note.updatedAt
                                                    ).toLocaleDateString()
                                                    : "Unknown"}
                                            </div>
                                            {note.isPublic && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-secondary uppercase tracking-widest">
                                                    <Globe size={10} />
                                                    Public
                                                </div>
                                            )}
                                            {note.tags.length > 0 && (
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                                                    <span className="text-[9px] font-black text-zinc-700 uppercase">{note.tags[0]}</span>
                                                </div>
                                            )}
                                        </div>
                                </div>
                                </Link>

                                <button
                                    aria-label="Delete note"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onDelete(note.id);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:text-destructive transition-all cursor-pointer z-10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        );
                    })}
                    {filteredNotes.length === 0 && (
                        <div className="text-center py-12 px-6 space-y-4">
                            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto flex items-center justify-center">
                                <Search size={20} className="text-zinc-700" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">No Neural Data Found</p>
                                <Button variant="link" onClick={() => setFilter("")} className="text-primary p-0 h-auto font-black uppercase text-[10px] tracking-widest">Reset Filter</Button>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
