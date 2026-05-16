"use client";

import {
    useState,
    useEffect,
} from "react";

import {
    useParams,
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";

import {
    api,
    Note,
} from "@/lib/api";

import { NoteEditor } from "@/component/NoteEditor";

import { AISidebar } from "@/component/AISidebar";

import { NoteList } from "@/component/NoteList";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import { Button } from "@/component/ui/button";

import {
    PanelLeftClose,
    PanelLeft,
    PanelRightClose,
    PanelRight,
    Sparkles,
    FileText,
} from "lucide-react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

export function Workspace() {
    const params = useParams();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const id =
        params.id as string;
    const router = useRouter();
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isNoteListOpen, setIsNoteListOpen] = useState(true);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    const isArchive = pathname?.startsWith("/archive");
    const isShared = pathname?.startsWith("/shared");
    const search = searchParams.get("search") || undefined;

    async function fetchCurrentNote(
        noteId: string
    ) {
        try {
            const res =
                await api.getNote(noteId);

            setCurrentNote(res.data);
        } catch {
            toast.error(
                "Note not found"
            );
        }
    }

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.getNotes({ 
                    archived: isArchive, 
                    public: isShared,
                    search 
                });
                setNotes(res.data);
            } catch {
                console.error("Failed to fetch notes");
            }
        };
        fetchNotes();
    }, [isArchive, isShared, search]);

    useEffect(() => {
        if (id) {
            fetchCurrentNote(id);
        }
    }, [id]);

    useEffect(() => {
        if (!id && notes.length > 0) {
            const query = search ? `?search=${search}` : "";
            const prefix = isArchive ? "/archive" : isShared ? "/shared" : "/notes";
            router.push(`${prefix}/${notes[0].id}${query}`);
        }
    }, [id, notes, router, search, isArchive, isShared]);

    const saveNote = async (note: Note) => {
        setSaveStatus("saving");
        try {
            const res = await api.updateNote(note.id, {
                title: note.title,
                content: note.content,
                isPublic: note.isPublic,
                isArchived: note.isArchived,
                tags: note.tags,
                category: note.category,
            });
            
            setNotes(prev => prev.map(n => n.id === res.data.id ? res.data : n));
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (error) {
            console.error("Autosave failed", error);
            setSaveStatus("error");
            toast.error("Failed to sync changes");
        }
    };

    useEffect(() => {
        if (!currentNote) return;
        
        const timeout = setTimeout(() => {
            saveNote(currentNote);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [currentNote?.title, currentNote?.content, currentNote?.tags, currentNote?.isPublic, currentNote?.isArchived, currentNote?.category]);


const handleUpdateNote = (data: Partial<Note>) => {
    if (!currentNote) return;

    const updatedNote = {
        ...currentNote,
        ...data,
    };

    setCurrentNote(updatedNote);

    setNotes((prev) => {
        // If the note was archived/unarchived or shared/unshared, 
        // we might need to remove it from the current view's list
        if (isArchive && data.isArchived === false) {
            router.push("/archive");
            return prev.filter(n => n.id !== currentNote.id);
        }
        if (isShared && data.isPublic === false) {
            router.push("/shared");
            return prev.filter(n => n.id !== currentNote.id);
        }
        if (!isArchive && !isShared && data.isArchived === true) {
            router.push("/notes");
            return prev.filter(n => n.id !== currentNote.id);
        }

        return prev.map((n) =>
            n.id === currentNote.id ? { ...n, ...data } : n
        );
    });
};

    const handleDeleteNote = async (noteId: string) => {
        try {
            await api.deleteNote(noteId);
            setNotes(prev => prev.filter(n => n.id !== noteId));
            if (id === noteId) {
                router.push("/notes");
            }
            toast.success("Note deleted");
        } catch {
            toast.error("Failed to delete note");
        }
    };

    return (
        <div className="flex-1 flex relative overflow-hidden bg-zinc-950">
            {/* Left Sidebar: Note List */}
            <AnimatePresence initial={false}>
                {isNoteListOpen && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="fixed inset-y-0 left-0 z-[45] w-[300px] border-r border-zinc-900 flex flex-col h-full bg-zinc-950/95 backdrop-blur-3xl lg:relative lg:inset-auto lg:z-0 lg:translate-x-0"
                    >
                        <NoteList
                            notes={notes}
                            activeId={id}
                            onDelete={handleDeleteNote}
                            onAdd={async () => {
                                const res =
                                    await api.createNote({
                                        title: "Untitled Note",
                                        content: "",
                                    });
                                setNotes((prev) => [
                                    res.data,
                                    ...prev,
                                ]);

                                router.push(
                                    `/notes/${res.data.id}`
                                );
                                if (window.innerWidth < 1024) setIsNoteListOpen(false);
                            }}
                        />
                        {/* Mobile close button for Note List */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-4 right-4 lg:hidden"
                            onClick={() => setIsNoteListOpen(false)}
                        >
                            <PanelLeftClose size={16} />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay for Note List */}
            {isNoteListOpen && (
                <div 
                    className="fixed inset-0 z-[44] bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsNoteListOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
                {/* Editor Toolbar (Local) */}
                <div className="h-14 border-b border-zinc-900 flex items-center justify-between px-4 md:px-6 bg-zinc-950/80 backdrop-blur-2xl sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-50 hover:bg-zinc-900"
                            onClick={() => setIsNoteListOpen(!isNoteListOpen)}
                        >
                            {isNoteListOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
                        </Button>
                        <div className="h-4 w-[1px] bg-zinc-800" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2 max-w-[120px] md:max-w-[200px]">
                                <FileText size={12} className="text-primary shrink-0" />
                                <span className="truncate">{currentNote?.title || "Note"}</span>
                            </span>
                            <div className="h-1 w-1 rounded-full bg-zinc-800" />
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest transition-all font-display",
                                saveStatus === "saving" ? "text-primary animate-pulse" : 
                                saveStatus === "saved" ? "text-secondary" : 
                                saveStatus === "error" ? "text-destructive" : "text-zinc-600"
                            )}>
                                {saveStatus === "saving" ? "Syncing..." : 
                                 saveStatus === "saved" ? "Synced" : 
                                 saveStatus === "error" ? "Sync Failed" : "Idle"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
                            className={cn(
                                "h-8 px-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg border-2 border-transparent",
                                isAISidebarOpen
                                    ? "bg-ai/10 text-ai border-ai/50"
                                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <Sparkles size={12} className={cn("mr-2", isAISidebarOpen && "animate-pulse")} fill={isAISidebarOpen ? "currentColor" : "none"} />
                            AI View
                        </Button>
                        <div className="h-4 w-[1px] bg-zinc-800" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-50 hover:bg-zinc-900"
                            onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
                        >
                            {isAISidebarOpen ? <PanelRightClose size={16} /> : <PanelRight size={16} />}
                        </Button>
                    </div>
                </div>

                {/* The Editor */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                    {currentNote ? (
                        <NoteEditor note={currentNote} onUpdate={handleUpdateNote} />
                    ) : (
                        <div className="h-full flex items-center justify-center p-8">
                            <div className="text-center space-y-6">
                                <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Sparkles className="w-10 h-10 text-primary relative z-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter font-display text-zinc-100">Ready to write</h3>
                                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] font-display">Select a note or create a new one to start.</p>
                                </div>
                                <Button
                                    onClick={async () => {
                                        const res =
                                            await api.createNote({
                                                title: "Untitled Note",
                                                content: "",
                                            });
                                        setNotes((prev) => [
                                            res.data,
                                            ...prev,
                                        ]);
                                        router.push(
                                            `/notes/${res.data.id}`
                                        );
                                    }}
                                    className="brutal-btn-primary h-12 px-8 font-display"
                                >
                                    Create New Note
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar: AI Assistant */}
            <AnimatePresence initial={false}>
                {isAISidebarOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="fixed inset-y-0 right-0 z-[45] w-full max-w-[380px] border-l border-zinc-900 h-full bg-zinc-950/95 backdrop-blur-3xl lg:relative lg:inset-auto lg:z-0 lg:translate-x-0"
                    >
                        <AISidebar note={currentNote} />
                        {/* Mobile close button for AI */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-4 left-4 lg:hidden"
                            onClick={() => setIsAISidebarOpen(false)}
                        >
                            <PanelRightClose size={16} />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Overlay for AI Sidebar */}
            {isAISidebarOpen && (
                <div 
                    className="fixed inset-0 z-[44] bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsAISidebarOpen(false)}
                />
            )}
        </div>
    );
}
