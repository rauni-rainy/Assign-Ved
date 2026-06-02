export default function PaperMeta({ timeAllowed, maxMarks, grade }: { timeAllowed: string, maxMarks: string, grade: string }) {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 text-[14px] font-semibold text-gray-900 gap-2">
        <div>Time Allowed: {timeAllowed}</div>
        <div>Maximum Marks: {maxMarks}</div>
      </div>
      
      <p className="text-[14px] font-bold text-gray-900 mb-8">
        All questions are compulsory unless stated otherwise.
      </p>

      <div className="flex flex-col gap-3 text-[14px] font-bold text-gray-900">
        <div>Name: ________________________</div>
        <div>Roll Number: _________________</div>
        <div>Class: {grade} Section: __________</div>
      </div>
    </div>
  );
}
