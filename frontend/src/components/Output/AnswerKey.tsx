import React from "react";

export default function AnswerKey({ answers }: { answers: { id: number, text: React.ReactNode }[] }) {
  return (
    <div className="mt-12 pt-10">
      <h4 className="text-[16px] font-bold text-gray-900 mb-6">Answer Key:</h4>
      <div className="flex flex-col gap-5">
        {answers.map((a, index) => (
          <div key={a.id} className="flex gap-2 text-[14px] text-gray-800 leading-relaxed">
            <span className="shrink-0 w-6">{index + 1}.</span>
            <div className="flex-1">
              {a.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
