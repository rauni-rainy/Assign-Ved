"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAssignments } from "@/lib/api";

interface SidebarProps {
  activeTab?: string;
  primaryActionText?: string;
  primaryActionIcon?: string;
  primaryActionHref?: string;
}

export default function Sidebar({
  activeTab = "Assignments",
  primaryActionText = "Create Assignment",
  primaryActionIcon = "auto_awesome",
  primaryActionHref = "/create",
}: SidebarProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchAssignments().then(res => {
      if (res.success) setCount(res.data.length);
    }).catch(() => {});
  }, []);

  return (
    <aside className="hidden md:flex w-[280px] h-full bg-white rounded-2xl flex-col justify-between p-6 shadow-sm flex-shrink-0 z-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 pl-3">
          <Image src="/sidebar-logo.png" alt="VedaAI Logo" width={32} height={32} className="object-contain" />
          <span className="text-[22px] font-bold text-gray-900 tracking-tight">VedaAI</span>
        </div>

        <Link href={primaryActionHref} className="bg-[#2D3035] text-white border-2 border-[#F97316] rounded-full py-3 px-5 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer shadow-[0_0_10px_rgba(249,115,22,0.2)] hover:bg-[#1F2937] hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all mx-1 no-underline">
          <span className="material-symbols-rounded text-xl">{primaryActionIcon}</span>
          {primaryActionText}
        </Link>

        <nav className="flex flex-col gap-1">
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors group ${activeTab === "Home" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-900"}`}>
            <span className={`material-symbols-rounded text-[22px] transition-colors ${activeTab === "Home" ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"}`} style={{ fontVariationSettings: activeTab === "Home" ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>grid_view</span>
            Home
          </Link>
          <Link href="/groups" className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors group ${activeTab === "My Groups" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-900"}`}>
            <span className={`material-symbols-rounded text-[22px] transition-colors ${activeTab === "My Groups" ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"}`} style={{ fontVariationSettings: activeTab === "My Groups" ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>group</span>
            My Groups
          </Link>
          <Link href="/" className={`flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-colors group ${activeTab === "Assignments" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-900"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-rounded text-[22px] transition-colors ${activeTab === "Assignments" ? "text-gray-900" : "text-gray-400 group-hover:text-gray-500"}`} style={{ fontVariationSettings: activeTab === "Assignments" ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>description</span>
              Assignments
            </div>
            {count > 0 && <span className="bg-[#FF6B00] text-white text-[11px] font-bold px-2 py-[2px] rounded-full">{count}</span>}
          </Link>
          <Link href="/toolkit" className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors group ${activeTab === "AI Teacher's Toolkit" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-900"}`}>
            <span className="material-symbols-rounded text-[22px] text-gray-400 group-hover:text-gray-500 transition-colors" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>smartphone</span>
            AI Teacher's Toolkit
          </Link>
          <Link href="/library" className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors group ${activeTab === "My Library" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-900"}`}>
            <span className="material-symbols-rounded text-[22px] text-gray-400 group-hover:text-gray-500 transition-colors" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>history</span>
            My Library
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors group mb-2">
          <span className="material-symbols-rounded text-[22px] text-gray-400 group-hover:text-gray-500 transition-colors" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>settings</span>
          Settings
        </Link>
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-2xl">
          <Image src="/Component 1.png" alt="School Logo" width={40} height={40} className="rounded-full object-cover bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-gray-900">Delhi Public School</span>
            <span className="text-xs text-gray-500 mt-0.5">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
