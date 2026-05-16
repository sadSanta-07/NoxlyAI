"use client";

import { Folder, Plus } from "lucide-react";
import { Badge } from "@/component/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/component/ui/dropdown-menu";
import { useState } from "react";
import { Note } from "@/lib/api";

interface NoteTagBarProps {
    note: Note;
    onUpdate: (data: Partial<Note>) => void;
}

export function NoteTagBar({ note, onUpdate }: NoteTagBarProps) {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTag, setNewTag] = useState("");

    return (
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide max-w-4xl mx-auto px-6 md:px-12 mt-4">
            {/* Category Selector */}
            <div className="flex items-center gap-2">
                <Folder size={14} className="text-zinc-600" />
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-zinc-900 text-zinc-400 border border-zinc-800 py-1.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-colors focus:outline-none flex items-center gap-2 font-display">
                        {note.category || "No Category"}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl">
                        {["Work", "Personal", "Ideas", "Research", "Project"].map(cat => (
                            <DropdownMenuItem 
                                key={cat} 
                                onClick={() => onUpdate({ category: cat })}
                                className="rounded-xl focus:bg-zinc-800 focus:text-primary font-black uppercase text-[9px] p-2 transition-colors font-display"
                            >
                                {cat}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem 
                            onClick={() => onUpdate({ category: undefined })}
                            className="rounded-xl focus:bg-zinc-800 focus:text-zinc-500 font-black uppercase text-[9px] p-2 transition-colors font-display"
                        >
                            Clear Category
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="h-6 w-[1px] bg-zinc-900 mx-2" />

            {note.tags.map(tag => (
                <Badge key={tag} className="bg-zinc-900 text-zinc-400 border border-zinc-800 py-1.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-colors cursor-pointer font-display">
                    #{tag}
                </Badge>
            ))}
            
            {isAddingTag ? (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (newTag.trim()) {
                        const updatedTags = [...new Set([...note.tags, newTag.trim()])];
                        onUpdate({ tags: updatedTags });
                        setNewTag("");
                    }
                    setIsAddingTag(false);
                }} className="flex items-center">
                    <input
                        autoFocus
                        className="bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase text-zinc-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-primary/50 w-24"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onBlur={() => setIsAddingTag(false)}
                        placeholder="NEW TAG..."
                    />
                </form>
            ) : (
                <button
                    onClick={() => setIsAddingTag(true)}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary transition-all bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-lg hover:border-zinc-700 font-display"
                >
                    <Plus size={10} className="stroke-[3px]" /> Append Tag
                </button>
            )}
        </div>
    );
}
