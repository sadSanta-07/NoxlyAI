"use client";

import { Sidebar } from "@/component/Sidebar";

import { Navbar } from "@/component/Navbar";

import { Workspace } from "@/views/Workspace";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function NotePage() {
  const router = useRouter();
  const { token, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && !token) {
      router.push("/auth");
    }
  }, [_hasHydrated, token, router]);

  if (!token) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <Workspace />
      </div>
    </div>
  );
}