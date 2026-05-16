import { useState, useEffect } from "react";
import { api, Note } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import {
    Type,
    Eye,
    Edit3,
    Hash,
    Image as ImageIcon,
    Link as LinkIcon,
    MoreHorizontal,
    Share2,
    Lock,
    Globe,
    Sparkles,
    RefreshCcw,
    Check,
    Plus,
    Tag,
    Folder
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { Badge } from "@/component/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/component/ui/dropdown-menu";
import { toast } from "sonner";
import {
    motion,
    AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
    note: Note;
    onUpdate: (data: Partial<Note>) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
    const [mode, setMode] = useState<"edit" | "preview">("edit");
    const [localContent, setLocalContent] = useState(note.content);
    const [localTitle, setLocalTitle] = useState(note.title);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        setLocalContent(note.content);
        setLocalTitle(note.title);
        
        // Auto-resize textareas on load
        setTimeout(() => {
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(t => {
                t.style.height = 'auto';
                t.style.height = t.scrollHeight + 'px';
            });
        }, 0);
    }, [note.id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localTitle !== note.title || localContent !== note.content) {
                onUpdate({
                    title: localTitle,
                    content: localContent,
                });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [localTitle, localContent]);


    const handleSuggestTitle =
        async () => {
            if (!localContent.trim()) {
                toast.error(
                    "Add some content first!"
                );

                return;
            }

            setIsGeneratingTitle(true);

            try {
                const res =
                    await api.generateSummary(
                        note.id
                    );

                const suggested =
                    res.data.suggested_title;

                if (suggested) {
                    setLocalTitle(suggested);

                    await api.updateNote(
                        note.id,
                        {
                            title: suggested,
                        }
                    );

                    onUpdate({
                        title: suggested,
                    });

                    toast.success(
                        "AI suggested a new title!"
                    );
                }
            } catch {
                toast.error(
                    "Failed to generate title"
                );
            } finally {
                setIsGeneratingTitle(false);
            }
        };



    return (
        <div className="flex flex-col bg-zinc-950">
            {/* Editor Header */}
            <div className="px-12 pt-24 pb-16 border-b border-zinc-900 bg-zinc-950/20">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="flex-1 relative group">
                            <textarea
                                value={localTitle}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setLocalTitle(value);
                                }}
                                className={cn(
                                    "w-full bg-transparent font-black tracking-tighter uppercase focus:outline-none placeholder:text-zinc-900 leading-[0.85] resize-none h-auto min-h-[1em] py-2 overflow-hidden font-display transition-all focus:placeholder:opacity-0",
                                    localTitle.length > 40 ? "text-2xl sm:text-3xl md:text-5xl" : 
                                    localTitle.length > 20 ? "text-3xl sm:text-4xl md:text-6xl" : 
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
                                className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary hover:scale-110 disabled:animate-spin"
                            >
                                {isGeneratingTitle ? <RefreshCcw size={20} /> : <Sparkles size={20} />}
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

                    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
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
                                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary transition-all bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-lg hover:border-zinc-700"
                            >
                                <Plus size={10} className="stroke-[3px]" /> Append Tag
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 px-4 md:px-12 py-12">
                <div className="max-w-4xl mx-auto h-full relative">
                    {mode === "edit" ? (
                        <textarea
                            className="w-full min-h-[500px] bg-transparent text-xl leading-relaxed text-zinc-300 font-medium focus:outline-none resize-none placeholder:text-zinc-900 selection:bg-primary/20 selection:text-primary font-sans"
                            placeholder="Start writing your thoughts..."
                            value={localContent}
                            onChange={(e) => {
                                const value = e.target.value;
                                setLocalContent(value);
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                    ) : (
                        <div className="prose prose-invert prose-p:text-zinc-400 prose-headings:text-zinc-100 prose-headings:font-black prose-headings:italic prose-p:font-medium prose-p:text-lg max-w-none prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-3xl prose-hr:border-zinc-900 prose-a:text-primary prose-strong:text-white font-sans">
                            <ReactMarkdown>{localContent || "*The canvas is empty. Start typing to begin.*"}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
