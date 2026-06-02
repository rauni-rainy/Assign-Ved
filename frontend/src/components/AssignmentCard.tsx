"use client";

import { useState } from "react";

interface AssignmentCardProps {
  title: string;
  assignedOn: string;
  due: string;
  isMenuOpen?: boolean;
}

export default function AssignmentCard({ title, assignedOn, due, isMenuOpen = false }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(isMenuOpen);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative">
      <div className="flex justify-between items-start">
        <h3 className="text-[20px] font-bold text-gray-900 tracking-tight">{title}</h3>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-1 -mr-2 -mt-1 rounded-full hover:bg-gray-50"
        >
          <span className="material-symbols-rounded">more_vert</span>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-14 right-6 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] border border-gray-100 py-2 w-44 z-10">
          <button className="w-full text-left px-5 py-2.5 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 bg-transparent border-none cursor-pointer transition-colors">
            View Assignment
          </button>
          <button className="w-full text-left px-5 py-2.5 text-[13px] font-semibold text-[#EF4444] hover:bg-red-50 bg-transparent border-none cursor-pointer transition-colors">
            Delete
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-[13px]">
        <div>
          <span className="font-bold text-gray-900">Assigned on : </span>
          <span className="text-gray-500 font-medium">{assignedOn}</span>
        </div>
        <div>
          <span className="font-bold text-gray-900">Due : </span>
          <span className="text-gray-500 font-medium">{due}</span>
        </div>
      </div>
    </div>
  );
}
