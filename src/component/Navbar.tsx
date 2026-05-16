"use client";

import { useState } from "react";

import {
  Search,
  Bell,
  Sparkles,
  Command,
} from "lucide-react";

import { Input } from "@/component/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/component/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/component/ui/avatar";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/component/ui/dropdown-menu";

export function Navbar() {

  const { user, clearAuth } = useAuthStore();
  const [search, setSearch] = useState("");
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-8 backdrop-blur-md">
      {/* SEARCH */}

      <div className="flex max-w-xl flex-1 items-center gap-6">
        <div className="group relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-primary" />

          <Input
            placeholder="Search documents, ideas, or actions..."
            className="h-10 rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 text-sm font-medium transition-all focus-visible:border-primary/50 focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const path = search.trim() ? `/notes?search=${encodeURIComponent(search)}` : "/notes";
                router.push(path);
              }
            }}
          />

          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-zinc-500">
            <Command size={10} />

            <span>K</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3">


        {/* AI BUTTON */}

        <Button className="brutal-btn-primary group h-10 scale-90 px-4 text-xs tracking-tight sm:scale-100">
          <Sparkles className="h-4 w-4 group-hover:animate-pulse" />

          <span>
            Sync Session
          </span>
        </Button>

        {/* DIVIDER */}

        <div className="mx-2 h-6 w-[1px] bg-zinc-800" />

        {/* PROFILE */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="overflow-hidden rounded-xl ring-offset-zinc-950 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2">
              <Avatar className="h-9 w-9 cursor-pointer rounded-xl border border-zinc-800 transition-colors hover:border-zinc-500">
                <AvatarImage src="https://github.com/shadcn.png" />

                <AvatarFallback className="bg-zinc-800 text-[10px] font-black">
                  {user?.name?.slice(0, 2).toUpperCase() || "JD"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl backdrop-blur-xl"
          >
            <DropdownMenuLabel className="p-2 text-xs font-black uppercase text-zinc-500">
              Workspace Engine
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-zinc-800" />

            <DropdownMenuItem
              onClick={() => {
                clearAuth();
                window.location.href = "/auth";
              }}
              className="rounded-xl p-3 text-xs font-black uppercase text-destructive transition-colors focus:bg-destructive focus:text-white cursor-pointer"
            >
              Terminate Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}