"use client";

import { useState, useEffect } from "react";
import { api, Note } from "@/lib/api";
import { toast } from "sonner";
import { NoteEditorHeader } from "./note-editor/NoteEditorHeader";
import { NoteTagBar } from "./note-editor/NoteTagBar";
import { NoteContent } from "./note-editor/NoteContent";

interface NoteEditorProps {
    note: Note;
    onUpdate: (data: Partial<Note>) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
    const [mode, setMode] = useState<"edit" | "preview">("edit");
    const [localContent, setLocalContent] = useState(note.content);
    const [localTitle, setLocalTitle] = useState(note.title);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

    useEffect(() => {
        setLocalContent(note.content);
        setLocalTitle(note.title);
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

    const handleSuggestTitle = async () => {
        if (!localContent.trim()) {
            toast.error("Add some content first!");
            return;
        }

        setIsGeneratingTitle(true);
        try {
            const res = await api.generateSummary(note.id);
            const suggested = res.data.suggested_title;

            if (suggested) {
                setLocalTitle(suggested);
                await api.updateNote(note.id, { title: suggested });
                onUpdate({ title: suggested });
                toast.success("AI suggested a new title!");
            }
        } catch {
            toast.error("Failed to generate title");
        } finally {
            setIsGeneratingTitle(false);
        }
    };

    return (
        <div className="flex flex-col bg-zinc-950 min-h-screen">
            <NoteEditorHeader 
                title={localTitle}
                setTitle={setLocalTitle}
                mode={mode}
                setMode={setMode}
                isGeneratingTitle={isGeneratingTitle}
                handleSuggestTitle={handleSuggestTitle}
                note={note}
                onUpdate={onUpdate}
            />

            <NoteTagBar 
                note={note}
                onUpdate={onUpdate}
            />

            <NoteContent 
                content={localContent}
                setContent={setLocalContent}
                mode={mode}
                noteId={note.id}
            />
        </div>
    );
}
