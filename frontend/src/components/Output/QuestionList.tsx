type Question = {
  id: number;
  difficulty: string;
  text: string;
  marks: number;
};

export default function QuestionList({ 
  section, 
  type, 
  instructions, 
  questions 
}: { 
  section: string, 
  type: string, 
  instructions: string, 
  questions: Question[] 
}) {
  return (
    <div className="mb-10">
      <h4 className="text-center text-[18px] md:text-[20px] font-bold text-gray-900 mb-8">{section}</h4>
      <h5 className="text-[15px] md:text-[16px] font-bold text-gray-900 mb-1">{type}</h5>
      <p className="text-[13px] md:text-[14px] italic text-gray-700 mb-6">{instructions}</p>

      <div className="flex flex-col gap-5">
        {questions.map((q, index) => (
          <div key={q.id} className="flex gap-2 text-[14px] text-gray-800 leading-relaxed">
            <span className="shrink-0 w-6">{index + 1}.</span>
            <p>
              [{q.difficulty}] {q.text} [{q.marks} Marks]
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10 mb-4 font-bold text-[14px] text-gray-900">
        End of Question Paper
      </div>
    </div>
  );
}
