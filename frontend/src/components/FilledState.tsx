"use client";

import { useEffect, useState, useMemo } from "react";
import AssignmentCard from "./AssignmentCard";
import EmptyState from "./EmptyState";
import Link from "next/link";
import { fetchAssignments, deleteAssignment } from "@/lib/api";
import BottomNav from "@/components/BottomNav";

export default function FilledState() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("assigned_desc");

  const loadData = async () => {
    try {
      const res = await fetchAssignments();
      if (res.success) setAssignments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(id);
        loadData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredAndSortedAssignments = useMemo(() => {
    let result = assignments.filter(a => 
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortBy === 'assigned_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'assigned_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'due_desc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortBy === 'due_asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return result;
  }, [assignments, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full h-full text-gray-500 font-medium">
        Loading assignments...
      </div>
    );
  }

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden">
      {/* Header text */}
      <div className="px-4 md:px-6 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[10px] h-[10px] bg-[#4ADE80] rounded-full border-2 border-[#bbf7d0]"></div>
          <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Assignments</h1>
        </div>
        <p className="text-[13px] text-gray-400 font-medium mt-1 ml-6">Manage and create assignments for your classes.</p>
      </div>

      {/* Filter bar */}
      <div className="px-4 md:px-6 py-4 shrink-0 flex justify-center md:justify-start">
        <div className="bg-white md:rounded-full rounded-[24px] px-4 md:px-5 py-0 md:py-3 flex items-center justify-between shadow-sm md:shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-row w-full max-w-[373px] md:max-w-full md:w-full h-[64px] md:h-auto gap-2 md:gap-0 mx-auto md:mx-0">
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <span className="material-symbols-rounded text-[20px] text-gray-400">sort</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[12px] md:text-[13px] font-medium text-gray-600 bg-transparent border-none outline-none cursor-pointer w-24 md:w-auto truncate"
            >
              <option value="assigned_desc">Newest First</option>
              <option value="assigned_asc">Oldest First</option>
              <option value="due_asc">Due Soon</option>
              <option value="due_desc">Due Later</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 md:gap-2.5 bg-gray-50 md:bg-white border md:border-gray-200 border-transparent rounded-full px-3 md:px-4 py-1.5 md:py-2 w-full max-w-[160px] md:max-w-64 hover:border-gray-300 transition-colors shrink min-w-0">
            <span className="material-symbols-rounded text-gray-400 text-[18px] shrink-0">search</span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] md:text-[13px] text-gray-700 w-full placeholder:text-gray-400 font-medium min-w-0" 
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-32 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {filteredAndSortedAssignments.map((item, i) => (
            <AssignmentCard 
              key={item._id} 
              id={item._id}
              title={item.title} 
              assignedOn={new Date(item.createdAt).toLocaleDateString()} 
              due={item.dueDate || ''} 
              isMenuOpen={false}
              onDelete={handleDelete}
            />
          ))}
        </div>
        
        {/* Inline BottomNav for Mobile */}
        <div className="mt-8 mb-4 md:hidden">
          <BottomNav isInline={true} />
        </div>
      </div>

      {/* Bottom fade & Floating Button */}
      <div className="hidden md:flex absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#DADADA] via-[#DADADA]/80 to-transparent pointer-events-none items-end justify-center pb-6 z-20">
        <Link href="/create" className="pointer-events-auto bg-[#1A1C20] text-white border-none rounded-full py-3.5 px-6 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-black active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)] no-underline">
          <span className="material-symbols-rounded text-[20px]">add</span>
          Create Assignment
        </Link>
      </div>
    </div>
  );
}
