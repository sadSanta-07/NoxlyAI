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
        queueMicrotask(() => {
            if (id) {
                fetchCurrentNote(id);
            }
        });
    }, [id]);

    useEffect(() => {
        if (!id && notes.length > 0) {
            router.push(`/notes/${notes[0].id}`);
        }
    }, [id, notes, router]);

    useEffect(() => {
  if (!currentNote) return;

  const timeout = setTimeout(
    async () => {
      try {
        const res =
          await api.updateNote(
            currentNote.id,
            {
              title: currentNote.title,
              content: currentNote.content,
              isPublic: currentNote.isPublic,
              isArchived: currentNote.isArchived,
              tags: currentNote.tags,
            }
          );

        setNotes((prev) =>
          prev.map((n) =>
            n.id ===
            res.data.id
              ? res.data
              : n
          )
        );
      } catch {
        toast.error(
          "Autosave failed"
        );
      }
    },
    1200
  );

  return () =>
    clearTimeout(timeout);
}, [currentNote]);


const handleUpdateNote = (
  data: Partial<Note>
) => {
  if (!currentNote) return;

  setCurrentNote({
    ...currentNote,
    ...data,
  });

  setNotes((prev) =>
    prev.map((n) =>
      n.id === currentNote.id
        ? {
            ...n,
            ...data,
          }
        : n
    )
  );
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
        <div className="flex-1 min-h-0 flex h-full relative overflow-hidden bg-zinc-950">
            {/* Left Sidebar: Note List */}
            <AnimatePresence initial={false}>
                {isNoteListOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-r border-zinc-900 flex flex-col h-full bg-zinc-950/50 backdrop-blur-3xl"
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
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
                {/* Editor Toolbar (Local) */}
                <div className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <FileText size={12} className="text-primary" />
                                {currentNote?.title || "Project Draft"}
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
                            Neural View
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
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter font-display">Neural Core Active</h3>
                                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Select an entity to begin processing.</p>
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
                                    Initiate New Stream
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
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 380, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-l border-zinc-900 h-full bg-zinc-950/50 backdrop-blur-3xl"
                    >
                        <AISidebar note={currentNote} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
