export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <a href="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
        <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>grid_view</span>
        <span className="text-[10px] font-medium">Home</span>
      </a>
      <a href="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
        <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>group</span>
        <span className="text-[10px] font-medium">Groups</span>
      </a>
      <a href="#" className="flex flex-col items-center gap-1 text-gray-900">
        <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>description</span>
        <span className="text-[10px] font-semibold">Assignments</span>
      </a>
      <a href="#" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
        <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>history</span>
        <span className="text-[10px] font-medium">Library</span>
      </a>
    </nav>
  );
}
