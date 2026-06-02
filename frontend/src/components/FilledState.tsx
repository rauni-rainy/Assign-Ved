import AssignmentCard from "./AssignmentCard";
import Link from "next/link";

export default function FilledState() {
  const assignments = Array(8).fill({
    title: "Quiz on Electricity",
    assignedOn: "20-06-2025",
    due: "21-06-2025"
  });

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
      <div className="px-4 md:px-6 py-4 shrink-0">
        <div className="bg-white rounded-full px-5 py-3 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <button className="flex items-center gap-2 text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-600 transition-colors">
            <span className="material-symbols-rounded text-[20px]">filter_alt</span>
            <span className="text-[13px] font-medium text-gray-400">Filter By</span>
          </button>
          
          <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-4 py-2 w-64 hover:border-gray-300 transition-colors">
            <span className="material-symbols-rounded text-gray-400 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search Assignment" 
              className="bg-transparent border-none outline-none text-[13px] text-gray-700 w-full placeholder:text-gray-400 font-medium" 
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-32 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {assignments.map((item, i) => (
            <AssignmentCard 
              key={i} 
              title={item.title} 
              assignedOn={item.assignedOn} 
              due={item.due} 
              isMenuOpen={i === 0} // Open the first one just to match the screenshot
            />
          ))}
        </div>
      </div>

      {/* Bottom fade & Floating Button */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#E5E7EB] md:from-[#DADADA] via-[#E5E7EB]/80 md:via-[#DADADA]/80 to-transparent pointer-events-none flex items-end justify-center pb-8 md:pb-6 z-20">
        <Link href="/create" className="pointer-events-auto bg-[#1A1C20] text-white border-none rounded-full py-3.5 px-6 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-black active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)] no-underline">
          <span className="material-symbols-rounded text-[20px]">add</span>
          Create Assignment
        </Link>
      </div>
    </div>
  );
}
