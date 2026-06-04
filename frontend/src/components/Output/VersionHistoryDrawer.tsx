"use client";
import React, { useEffect, useState } from 'react';
import { fetchPaperVersions, fetchSpecificPaper } from '@/lib/api';

interface VersionHistoryDrawerProps {
  assignmentId: string;
  refreshTrigger?: any;
  onRestore: (paper: any) => void;
}

export default function VersionHistoryDrawer({ assignmentId, refreshTrigger, onRestore }: VersionHistoryDrawerProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      loadVersions();
    }
  }, [assignmentId, refreshTrigger]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const res = await fetchPaperVersions(assignmentId);
      if (res.success && res.data) {
        setVersions(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (paperId: string) => {
    try {
      const res = await fetchSpecificPaper(paperId);
      if (res.success && res.data) {
        onRestore(res.data);
      }
    } catch (e) {
      alert("Failed to load this version.");
    }
  };

  if (versions.length === 0) return null; // Only hide if exactly 0 versions (loading or error)

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-rounded text-gray-500">history</span>
        <h3 className="text-[15px] font-bold text-gray-900">Version History</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {versions.map((v, index) => (
          <div key={v._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-[13px] font-bold text-gray-900">
                {index === 0 ? "Latest Version" : `Version ${v.version}`}
              </p>
              <p className="text-[11px] font-medium text-gray-500">
                {new Date(v.createdAt).toLocaleString()}
              </p>
            </div>
            
            {index !== 0 && v.status === 'pdf_ready' && (
              <button 
                onClick={() => handleRestore(v._id)}
                className="text-[11px] font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View
              </button>
            )}
            {v.status === 'generating' && (
              <span className="text-[11px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">Generating...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
