import React from 'react';

export default function DocumentWrapper({ children, aiMessage, onDownload }: { children: React.ReactNode, aiMessage: string, onDownload?: () => void }) {
  return (
    <div className="w-full">
      <div className="bg-[#333333] rounded-[32px] p-6 md:p-8 w-full shadow-lg relative min-h-[800px]">
        {/* Top Header inside Dark Wrapper */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <p className="text-white text-[15px] font-bold leading-snug md:max-w-2xl tracking-wide">
            {aiMessage}
          </p>
          <button onClick={onDownload} className="bg-white text-gray-900 rounded-full px-5 py-2.5 text-[13px] font-bold flex items-center gap-2 shrink-0 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer border-none">
            <span className="material-symbols-rounded text-[18px]">download</span>
            Download as PDF
          </button>
        </div>

        {/* Inner White Paper */}
        <div className="bg-white rounded-2xl w-full p-8 md:p-12 shadow-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
