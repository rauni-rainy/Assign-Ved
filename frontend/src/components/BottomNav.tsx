"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav({ isInline = false }: { isInline?: boolean }) {
  const pathname = usePathname();
  
  if (!isInline && pathname === '/create') {
    return null;
  }
  
  const wrapperClass = isInline 
    ? "md:hidden w-full pt-2 pb-6 z-[60] pointer-events-none flex flex-col items-center px-0" 
    : "md:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 z-[60] pointer-events-none";

  return (
    <div className={wrapperClass}>
      {pathname !== '/create' && (
        <div className="flex justify-end mb-4 md:pr-2 w-full max-w-[373px] mx-auto pointer-events-none">
          <Link href="/create" className="w-[56px] h-[56px] bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] pointer-events-auto active:scale-95 transition-transform no-underline relative right-2">
            <span className="material-symbols-rounded text-[#FF6B00] text-3xl font-light">add</span>
          </Link>
        </div>
      )}
      
      <nav 
        className="bg-[#181818] rounded-[24px] flex justify-between items-center px-6 py-2 mx-auto pointer-events-auto"
        style={{
          width: '100%',
          maxWidth: '373px',
          height: '72px',
          boxShadow: '0px 32px 48px 0px rgba(0,0,0,0.2), 0px 16px 48px 0px rgba(0,0,0,0.12)',
          paddingTop: '8px',
          paddingRight: '24px',
          paddingBottom: '8px',
          paddingLeft: '24px'
        }}
      >
        <Link href="/" className="flex flex-col items-center justify-center gap-1 text-[#888888] hover:text-white transition-colors no-underline">
          <span className="material-symbols-rounded text-[24px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>grid_view</span>
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </Link>
        <Link href="/groups" className="flex flex-col items-center justify-center gap-1 text-white no-underline">
          <span className="material-symbols-rounded text-[24px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>group</span>
          <span className="text-[10px] font-semibold tracking-wide">My Groups</span>
        </Link>
        <Link href="/library" className="flex flex-col items-center justify-center gap-1 text-[#888888] hover:text-white transition-colors no-underline">
          <span className="material-symbols-rounded text-[24px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>note_add</span>
          <span className="text-[10px] font-medium tracking-wide">Library</span>
        </Link>
        <Link href="/toolkit" className="flex flex-col items-center justify-center gap-1 text-[#888888] hover:text-white transition-colors no-underline">
          <span className="material-symbols-rounded text-[24px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>auto_awesome</span>
          <span className="text-[10px] font-medium tracking-wide">Toolkit</span>
        </Link>
      </nav>
    </div>
  );
}
