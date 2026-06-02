export default function PaperHeader({ school, subject, grade }: { school: string, subject: string, grade: string }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-[22px] md:text-[26px] font-bold text-gray-900 mb-2 tracking-tight">{school}</h1>
      <h2 className="text-[18px] md:text-[20px] font-semibold text-gray-800 mb-1">Subject: {subject}</h2>
      <h3 className="text-[18px] md:text-[20px] font-semibold text-gray-800">Class: {grade}</h3>
    </div>
  );
}
