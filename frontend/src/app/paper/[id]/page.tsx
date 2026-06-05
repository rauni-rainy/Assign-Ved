"use client";
import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import DocumentWrapper from "@/components/Output/DocumentWrapper";
import PaperHeader from "@/components/Output/PaperHeader";
import PaperMeta from "@/components/Output/PaperMeta";
import QuestionList from "@/components/Output/QuestionList";
import BloomsChart from "@/components/Output/BloomsChart";
import VersionHistoryDrawer from "@/components/Output/VersionHistoryDrawer";
import { useParams } from 'next/navigation';
import { fetchQuestionPaper, downloadPDF, regenerate } from '@/lib/api';
import { useGenerationSocket } from '@/hooks/useGenerationSocket';

export default function PaperPage() {
  const params = useParams();
  const assignmentId = params.id as string;
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  const { isComplete, step, error, percentage, clearError } = useGenerationSocket(assignmentId);

  const [interactiveText, setInteractiveText] = useState("Preparing your document...");
  
  useEffect(() => {
    if (paper?.status === 'generating' || !paper) {
      const phrases = [
        "Hang on, loading content...",
        "Structuring questions...",
        "Adding final touches...",
        "Improving margins...",
        "Cross-checking data...",
        "Formatting your paper...",
        "Almost there..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % phrases.length;
        setInteractiveText(phrases[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [paper?.status, paper]);

  const loadPaper = async () => {
    try {
      const res = await fetchQuestionPaper(assignmentId);
      if (res.success) {
        if (res.data) {
          setPaper(res.data);
        } else if (res.status === 'generating') {
          setPaper({ status: 'generating' });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      loadPaper();
    }
  }, [assignmentId, isComplete]);

  const handleDownload = () => {
    if (paper?._id) {
      downloadPDF(paper._id, showAnswers);
    }
  };

  const handleRegenerate = async () => {
    if (paper?._id || assignmentId) {
      try {
        clearError();
        setPaper({ ...paper, status: 'generating' });
        await regenerate(paper?._id || assignmentId);
      } catch (e) {
        console.error("Regeneration failed", e);
      }
    }
  };

  if (loading) {
    return <DashboardLayout activeTab="Home"><div className="p-8 flex justify-center text-gray-500 font-medium">Loading...</div></DashboardLayout>;
  }

  if (error) {
    return (
      <DashboardLayout activeTab="Home" title="Generation Failed">
        <div className="p-8 flex flex-col items-center justify-center text-center h-[60vh]">
          <div className="w-20 h-20 bg-red-50 border-[6px] border-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-rounded text-4xl">error</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Generation Interrupted</h2>
          <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl mb-8 max-w-md w-full border border-red-100 shadow-sm">
            <p className="font-medium text-sm">{error || "An unexpected error occurred while generating your paper."}</p>
            <p className="text-xs text-red-500 mt-2">Please check your inputs and try again, or contact support if the issue persists.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.history.back()} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Go Back
            </button>
            <button onClick={handleRegenerate} className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-black transition-colors shadow-md hover:shadow-lg">
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (paper?.status === 'generating' || !paper) {
    return (
      <DashboardLayout activeTab="Home" title="Generating">
        <div className="p-8 flex flex-col items-center justify-center h-[60vh]">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-blue-500 border-r-purple-500 rounded-full animate-spin shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-600">{percentage}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Generating Question Paper</h2>
          <p className="text-blue-600 font-medium mb-1 text-lg">{step}</p>
          <p className="text-gray-400 font-medium text-sm animate-pulse h-6 flex items-center justify-center transition-all duration-300">
            {interactiveText}
          </p>
          
          <div className="w-64 bg-gray-100 rounded-full h-1.5 mt-8 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      showGridIcon={false} 
      headerIcon="auto_awesome"
      title="View Paper"
      activeTab="Home"
    >
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-24 no-scrollbar w-full flex flex-col mx-auto max-w-5xl gap-6">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <button 
              onClick={() => setShowAnswers(false)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors ${!showAnswers ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Student Mode
            </button>
            <button 
              onClick={() => setShowAnswers(true)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors ${showAnswers ? 'bg-green-100 text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Teacher Mode
            </button>
          </div>

          <div className="flex gap-3">
            <button onClick={handleRegenerate} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-100 transition-colors cursor-pointer border-none">
              Regenerate Paper
            </button>
            <button onClick={handleDownload} className="text-sm bg-[#2D3035] text-white px-4 py-2 rounded font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2 cursor-pointer border-none">
              <span className="material-symbols-rounded text-[18px]">download</span>
              Download PDF
            </button>
          </div>
        </div>
        
        <DocumentWrapper aiMessage="Here is the generated Question Paper based on your parameters:" onDownload={handleDownload}>
          <PaperHeader school={paper?.metadata?.school || "School Name"} subject={paper?.metadata?.subject || "Subject"} grade={paper?.metadata?.grade || "Grade"} />
          <PaperMeta timeAllowed={paper?.metadata?.duration || "2 Hours"} maxMarks={paper?.metadata?.totalMarks || 100} grade={paper?.metadata?.grade || "Grade"} />
          
          {paper?.sections?.map((sec: any, idx: number) => (
            <QuestionList 
              key={idx}
              section={sec.title} 
              type="" 
              instructions={sec.instructions} 
              questions={sec.questions}
              showAnswers={showAnswers}
            />
          ))}
          <div className="mt-10 font-bold text-[14px] text-gray-900 text-center">
            --- End of Question Paper ---
          </div>
        </DocumentWrapper>
        
        {/* Bottom Elements */}
        <div className="flex flex-col md:flex-row gap-6 mt-4 w-full">
          <div className="flex-1">
            <BloomsChart sections={paper?.sections || []} />
          </div>
          <div className="flex-1">
            <VersionHistoryDrawer 
              assignmentId={assignmentId} 
              refreshTrigger={paper?._id}
              onRestore={(restoredPaper) => setPaper(restoredPaper)} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
