"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  showGridIcon?: boolean;
  headerIcon?: string;
  title?: string;
}

export default function Header({ showGridIcon = true, headerIcon = "grid_view", title = "Assignment" }: HeaderProps) {
  const router = useRouter();
  
  return (
    <header className="h-16 bg-white rounded-2xl flex items-center justify-between px-4 md:px-6 shadow-sm shrink-0">
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={() => router.back()} className="bg-transparent border-none cursor-pointer flex items-center justify-center text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors -ml-2">
          <span className="material-symbols-rounded text-[22px]">arrow_back</span>
        </button>
        {showGridIcon && <span className="material-symbols-rounded text-gray-300 text-xl hidden md:block">{headerIcon}</span>}
        <span className="text-[15px] font-medium text-gray-400">{title}</span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link href="/notifications" className="relative text-gray-900 cursor-pointer bg-transparent border-none p-1 block">
          <span className="material-symbols-rounded">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Link>
        <Link href="/profile" className="flex items-center gap-2 bg-white px-1 py-1 md:pr-2 rounded-full cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200 no-underline">
          <Image src="/use_avatar.jpg" alt="User Avatar" width={28} height={28} className="rounded-full object-cover bg-gray-100" />
          <span className="text-[13px] font-semibold text-gray-900 ml-1 hidden md:block">John Doe</span>
          <span className="material-symbols-rounded text-xl text-gray-500 hidden md:block">expand_more</span>
        </Link>
      </div>
    </header>
  );
}
