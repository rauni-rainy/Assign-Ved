import Image from "next/image";
import Link from "next/link";

export default function EmptyState() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center w-full px-4 text-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
        <Image src="/Illustrations.png" alt="No Assignments" fill className="object-contain" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-3">No assignments yet</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[520px]">
        Create your first assignment to start collecting and grading student<br className="hidden md:block" />
        submissions. You can set up rubrics, define marking criteria, and let AI<br className="hidden md:block" />
        assist with grading.
      </p>
      <Link href="/create" className="bg-gray-900 text-white border-none rounded-full py-3 px-6 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-black active:scale-95 shadow-sm no-underline">
        <span className="material-symbols-rounded text-xl">add</span>
        Create Your First Assignment
      </Link>
    </section>
  );
}
