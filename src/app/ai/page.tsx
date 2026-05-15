"use client";

import { Sidebar } from "@/component/Sidebar";

import { Navbar } from "@/component/Navbar";

import { AISidebar } from "@/component/AISidebar";

export default function AIPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <div className="flex-1 p-6">
          <AISidebar note={null} />
        </div>
      </div>
    </div>
  );
}