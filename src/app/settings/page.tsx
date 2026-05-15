"use client";

import { Sidebar } from "@/component/Sidebar";

import { Navbar } from "@/component/Navbar";

import { Settings } from "@/views/Settings";

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <Settings />
      </div>
    </div>
  );
}