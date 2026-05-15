"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

import { Sidebar } from "@/component/Sidebar";

import { Navbar } from "@/component/Navbar";

import { Dashboard } from "@/views/Dashboard";

import { CommandPalette } from "@/component/CommandPalette";

import { Toaster } from "sonner";

export default function HomePage() {
  const [
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
  ] = useState(false);

  const router = useRouter();

  const token =
    useAuthStore(
      (s) => s.token
    );

  useEffect(() => {
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (
        (e.metaKey ||
          e.ctrlKey) &&
        e.key === "k"
      ) {
        e.preventDefault();

        setIsCommandPaletteOpen(
          (prev) => !prev
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);


  if (!token) return null;
  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
      />

      <CommandPalette
        open={
          isCommandPaletteOpen
        }
        setOpen={
          setIsCommandPaletteOpen
        }
      />

      <div className="selection:text-primary flex h-screen overflow-hidden bg-zinc-950 font-sans text-zinc-50 selection:bg-primary/30">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col border-l border-zinc-900">
          <Navbar />

          <main className="relative flex-1 overflow-auto bg-zinc-950/20">
            <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)]" />
            </div>

            <Dashboard />
          </main>
        </div>
      </div>
    </>
  );
}