"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGenerationSocket } from '../hooks/useGenerationSocket';
import { regenerate } from '../lib/api';

const STEPS = [
  'Initializing',
  'Analyzing context',
  'Generating structure',
  'Generating questions',
  'Formatting paper',
  'Completed'
];

export default function GenerationTracker({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const { step, percentage, isComplete, error } = useGenerationSocket(assignmentId);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        router.push(`/paper/${assignmentId}`);
      }, 1000);
    }
  }, [isComplete, router, assignmentId]);

  const handleRetry = async () => {
    // Basic retry via page refresh or handling if a paper ID was passed
    // If we only have assignment ID and it failed at generation, we might need a dedicated retry.
    window.location.reload();
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Generating Question Paper...</h3>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Current Step Text */}
      <div className="text-sm font-medium text-blue-600 mb-6 text-center">
        {error ? <span className="text-red-500">Error: {error}</span> : step}
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {STEPS.map((s, idx) => {
          const stepIndex = STEPS.indexOf(step);
          const isDone = isComplete || (stepIndex > -1 && idx <= stepIndex);
          const isCurrent = s === step && !isComplete && !error;
          
          return (
            <div key={s} className="flex items-center text-sm">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                isDone ? 'bg-green-100 text-green-600' : 
                isCurrent ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 text-gray-400'
              }`}>
                {isDone ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                )}
              </div>
              <span className={isDone ? 'text-gray-800' : isCurrent ? 'text-blue-700 font-medium' : 'text-gray-400'}>
                {s}
              </span>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-6 text-center">
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
          >
            Retry Generation
          </button>
        </div>
      )}
    </div>
  );
}
