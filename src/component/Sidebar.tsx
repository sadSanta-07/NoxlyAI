"use client";

import { useState } from "react";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  Globe,
  Settings,
  Sparkles,
  Archive,
  Plus,
  Zap,
  BarChart4,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/component/ui/button";

import { api } from "@/lib/api";

export function Sidebar() {
  const [collapsed, setCollapsed] =
    useState(false);

  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: FileText,
      label: "All Notes",
      path: "/notes",
    },
    {
      icon: Globe,
      label: "Shared",
      path: "/shared",
    },
    {
      icon: Sparkles,
      label: "AI Assistant",
      path: "/ai",
    },
    {
      icon: Archive,
      label: "Archive",
      path: "/archive",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleCreateNote = async () => {
    try {
      const res = await api.createNote({
        title: "Untitled Note",
        content: "",
        tags: [],
        category: "general",
      });

      toast.success("New note created!");

      router.push(
        `/notes/${res.data.id}`
      );
    } catch {
      toast.error(
        "Failed to create note"
      );
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 80 : 280,
      }}
      className="relative z-40 flex h-full flex-col border-r border-zinc-900 bg-zinc-950 transition-all duration-300 ease-in-out"
    >
      {/* LOGO */}

      <div className="mb-4 flex items-center gap-3 p-6">
        <div className="brutal-shadow-sm flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-primary rotate-3 transition-transform hover:rotate-0">
          <Zap className="h-6 w-6 fill-current text-black" />
        </div>

        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-2xl font-black italic uppercase tracking-tighter"
          >
            Peblo AI
          </motion.span>
        )}
      </div>

      {/* CREATE BUTTON */}

      <div className="mb-6 px-4">
        <Button
          onClick={handleCreateNote}
          className={cn(
            "brutal-btn-primary font-display flex h-12 w-full items-center justify-center gap-2",
            collapsed && "px-0"
          )}
        >
          <Plus className="h-5 w-5 stroke-[3px]" />

          {!collapsed && "New Project"}
        </Button>
      </div>

      {/* NAVIGATION */}

      <nav className="scrollbar-hide flex-1 space-y-1.5 overflow-y-auto px-4">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
            >
              <div
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",

                  isActive
                    ? "border border-zinc-800 bg-zinc-900 text-zinc-50"
                    : "text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300",

                  collapsed &&
                  "justify-center px-0 py-3"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",

                    isActive
                      ? "text-primary"
                      : "text-zinc-500 group-hover:text-zinc-400"
                  )}
                  strokeWidth={
                    isActive ? 2.5 : 2
                  }
                />

                {!collapsed && (
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-wider",

                      isActive
                        ? "opacity-100"
                        : "opacity-70"
                    )}
                  >
                    {item.label}
                  </span>
                )}

                {isActive &&
                  !collapsed && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 h-4 w-1 rounded-r-full bg-primary shadow-[0_0_12px_rgba(250,204,21,0.5)]"
                    />
                  )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}

      <div className="mt-auto space-y-4 p-4">
        {!collapsed && (
          <div className="brutal-card bg-zinc-900/50 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <BarChart4
                  size={12}
                  className="text-secondary"
                />
                Intensity
              </span>

              <span className="text-[10px] font-black text-secondary">
                82%
              </span>
            </div>

            <div className="flex h-8 items-end gap-1.5">
              {[
                0.4,
                0.7,
                0.3,
                1,
                0.6,
                0.8,
                0.2,
              ].map((v, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 border border-black transition-all duration-500",

                    v > 0.8
                      ? "bg-primary"
                      : v > 0.5
                        ? "bg-secondary"
                        : "bg-zinc-700"
                  )}
                  style={{
                    height: `${v * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* USER CARD */}

        <div
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-zinc-700",

            collapsed &&
            "justify-center px-0"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-zinc-800 text-xs font-black text-secondary shadow-sm">
            {user?.name?.slice(0, 2).toUpperCase() || "JD"}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-black uppercase tracking-tight text-zinc-50">
                  {user?.name || "Guest"}
                </span>

                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
              </div>

              <span className="text-[10px] font-black uppercase italic tracking-tighter text-zinc-500">
                Pro Workspace
              </span>
            </div>
          )}
        </div>
      </div>

      {/* COLLAPSE BUTTON */}

      <button
        onClick={() =>
          setCollapsed(!collapsed)
        }
        className="absolute -right-3 top-1/2 z-50 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg border border-zinc-800 bg-black text-zinc-500 transition-all hover:border-primary hover:text-primary active:scale-90"
      >
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>
    </motion.aside>
  );
}