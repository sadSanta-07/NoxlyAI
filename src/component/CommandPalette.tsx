"use client";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
} from "@/component/ui/dialog";
import { api, Note } from "@/lib/api";
import {
  Search,
  FileText,
  Plus,
  Zap,
  Settings,
  Command,
} from "lucide-react";

import { Input } from "@/component/ui/input";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (
    open: boolean
  ) => void;
}) {
  const [query, setQuery] =
    useState("");

  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const actions = [
    {
      icon: Plus,
      label: "Create New Note",
      shortcut: "N",
      action: () =>
        router.push("/notes"),
    },

    {
      icon: Zap,
      label: "Ask AI Assistant",
      shortcut: "A",
      action: () => router.push("/ai"),
    },

    {
      icon: FileText,
      label: "Browse All Notes",
      shortcut: "O",
      action: () =>
        router.push("/notes"),
    },

    {
      icon: Settings,
      label: "System Settings",
      shortcut: "S",
      action: () =>
        router.push("/settings"),
    },
  ];

  const filteredActions = query
    ? actions.filter((a) =>
      a.label
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
    )
    : actions;

  useEffect(() => {
    const searchNotes = async () => {
      if (!query.trim()) {
        setNotes([]);
        return;
      }

      try {
        const res = await api.getNotes({
          search: query,
        });

        setNotes(res.data);
      } catch {
        setNotes([]);
      }
    };

    const timeout = setTimeout(
      searchNotes,
      300
    );

    return () =>
      clearTimeout(timeout);
  }, [query]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="brutal-shadow-lg max-w-2xl overflow-hidden rounded-2xl border-4 border-black bg-zinc-900 p-0">
        {/* SEARCH */}

        <div className="border-b-4 border-black bg-zinc-800 p-6">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />

            <Input
              autoFocus
              placeholder="What do you want to do?"
              className="h-12 border-none bg-transparent pl-10 text-xl font-bold placeholder:text-zinc-600 focus-visible:ring-0"
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="max-h-[400px] overflow-auto p-4">
          <div className="mb-4 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Available Actions
          </div>

          <div className="space-y-2">
            {filteredActions.map(
              (action, i) => (
                <motion.button
                  key={i}
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.99,
                  }}
                  onClick={() => {
                    action.action();

                    setOpen(false);
                  }}
                  className="group flex w-full items-center gap-4 rounded-xl border-2 border-transparent p-4 transition-all hover:border-black hover:bg-zinc-800 active:translate-y-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-zinc-800 transition-colors group-hover:bg-primary group-hover:text-black">
                    <action.icon className="h-5 w-5" />
                  </div>

                  <span className="flex-1 text-left font-black italic uppercase tracking-tighter transition-colors group-hover:text-primary">
                    {action.label}
                  </span>

                  <div className="flex items-center gap-1 rounded bg-black/30 px-2 py-1 font-mono text-[10px] text-zinc-500">
                    <Command size={10} />

                    <span>
                      {
                        action.shortcut
                      }
                    </span>
                  </div>
                </motion.button>
              )
            )}
            {notes.length > 0 && (
              <>
                <div className="mt-6 mb-2 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Notes
                </div>

                {notes.map((note) => (
                  <motion.button
                    key={note.id}
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    onClick={() => {
                      router.push(
                        `/notes/${note.id}`
                      );

                      setOpen(false);
                    }}
                    className="group flex w-full items-center gap-4 rounded-xl border-2 border-transparent p-4 transition-all hover:border-black hover:bg-zinc-800"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black bg-zinc-800">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-black uppercase tracking-tight">
                        {note.title}
                      </span>

                      <span className="text-xs text-zinc-500">
                        {note.tags?.join(", ")}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between border-t-4 border-black bg-zinc-950 p-4 text-[10px] font-bold text-zinc-600">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-black bg-zinc-900 px-1">
                ↑↓
              </kbd>

              Navigate
            </span>

            <span className="flex items-center gap-1">
              <kbd className="rounded border border-black bg-zinc-900 px-1">
                ↵
              </kbd>

              Select
            </span>
          </div>

          <span>
            Esc to Close
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}