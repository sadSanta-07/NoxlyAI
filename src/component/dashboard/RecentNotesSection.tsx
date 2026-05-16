"use client";

import { motion } from "framer-motion";
import { FileText, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/component/ui/badge";
import { Note } from "@/lib/api";

export function RecentNotesSection({ notes }: { notes: Note[] }) {
    return (
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
                {notes.length > 0 ? (
                    notes.slice(0, 4).map((note, index) => (
                        <NoteCard key={note.id} note={note} index={index} />
                    ))
                ) : (
                    <div className="col-span-full py-12 border-2 border-dashed border-zinc-900 rounded-[2rem] flex flex-col items-center justify-center text-zinc-600 gap-4">
                        <FileText size={48} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No notes found. Create your first one!</p>
                    </div>
                )}
            </div>
        </div>
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
