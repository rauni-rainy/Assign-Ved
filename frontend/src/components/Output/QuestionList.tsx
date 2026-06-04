import React from 'react';

type Question = {
  text: string;
  marks: number;
  type?: string;
  difficulty?: string;
  taxonomyLevel?: string;
  options?: string[];
};

export default function QuestionList({ 
  section, 
  type, 
  instructions, 
  questions,
  showAnswers
}: { 
  section: string, 
  type: string, 
  instructions: string, 
  questions: Question[],
  showAnswers?: boolean
}) {
  return (
    <div className="mb-10">
      <h4 className="text-center text-[18px] md:text-[20px] font-bold text-gray-900 mb-8">{section}</h4>
      {type && <h5 className="text-[15px] md:text-[16px] font-bold text-gray-900 mb-1">{type}</h5>}
      {instructions && <p className="text-[13px] md:text-[14px] italic text-gray-700 mb-6">{instructions}</p>}

      <div className="flex flex-col gap-6">
        {questions.map((q, index) => {
          // Determine badge color
          const diff = q.difficulty?.toLowerCase() || '';
          let bgClass = "bg-gray-100 text-gray-700";
          if (diff === 'easy') bgClass = "bg-green-100 text-green-800";
          else if (diff === 'medium' || diff === 'moderate') bgClass = "bg-amber-100 text-amber-800";
          else if (diff === 'hard') bgClass = "bg-red-100 text-red-800";

          return (
            <div key={index} className="flex gap-2 text-[14px] text-gray-800 leading-relaxed">
              <span className="shrink-0 w-6 font-bold">{index + 1}.</span>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-4">
                  <p className="flex-1">
                    {q.text}
                    <span className={`inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${bgClass}`}>
                      {q.difficulty}
                    </span>
                    {q.taxonomyLevel && (
                      <span className="inline-block ml-1 px-2 py-0.5 rounded text-[10px] font-medium text-purple-700 bg-purple-100 uppercase tracking-wide cursor-help" title="Bloom's Taxonomy Level">
                        {q.taxonomyLevel}
                      </span>
                    )}
                  </p>
                  <span className="shrink-0 font-bold whitespace-nowrap">[{q.marks} Marks]</span>
                </div>
                {/* Render options for MCQs */}
                {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                  <ol className="mt-2 pl-4 list-[lower-alpha] space-y-1 text-gray-700">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ol>
                )}
                {/* Render spacing for short/long answers */}
                {!showAnswers && q.type === 'ShortAnswer' && <div className="mt-6 mb-2 border-b border-dotted border-gray-400 w-full" />}
                {!showAnswers && q.type === 'LongAnswer' && <div className="mt-12 mb-2 border-b border-dotted border-gray-400 w-full" />}
                
                {/* Render expected answer */}
                {showAnswers && (q as any).expectedAnswer && (
                  <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-100">
                    <span className="text-[12px] font-bold text-green-700 uppercase tracking-wide block mb-1">Expected Answer:</span>
                    <p className="text-[14px] text-green-900 font-medium">{(q as any).expectedAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
