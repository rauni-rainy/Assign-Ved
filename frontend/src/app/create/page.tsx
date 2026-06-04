"use client";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/lib/api";
import BottomNav from "@/components/BottomNav";

type QuestionType = {
  type: string;
  count: number;
  marksEach: number;
};

export default function CreateAssignment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    board: "CBSE",
    additionalInstructions: "",
    dueDate: "",
  });

  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    { type: "MCQ", count: 5, marksEach: 1 },
    { type: "ShortAnswer", count: 3, marksEach: 2 }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
  const totalMarks = questionTypes.reduce((sum, qt) => sum + (qt.count * qt.marksEach), 0);

  const handleAddQuestionType = () => {
    setQuestionTypes([...questionTypes, { type: "MCQ", count: 1, marksEach: 1 }]);
  };

  const handleRemoveQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const updateQuestionType = (index: number, field: keyof QuestionType, value: any) => {
    const newTypes = [...questionTypes];
    newTypes[index] = { ...newTypes[index], [field]: value };
    setQuestionTypes(newTypes);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };



  const handleSubmit = async () => {
    if (!formData.title || !formData.subject || !formData.grade) {
      alert("Please fill in Title, Subject, and Grade.");
      return;
    }
    if (questionTypes.length === 0) {
      alert("Please add at least one question type.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subject', formData.subject);
      data.append('grade', formData.grade);
      data.append('board', formData.board);
      data.append('questionTypes', JSON.stringify(questionTypes));
      if (formData.additionalInstructions) {
        data.append('additionalInstructions', formData.additionalInstructions);
      }
      if (formData.dueDate) {
        data.append('dueDate', formData.dueDate);
      }
      if (file) {
        data.append('file', file);
      }

      const res = await createAssignment(data);
      if (res.success) {
        router.push(`/paper/${res.assignmentId}`);
      } else {
        alert("Failed: " + (res.message || "Unknown error"));
      }
    } catch (e: any) {
      alert("Failed to create assignment: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout showGridIcon={false}>
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-32 no-scrollbar relative">
        <div className="pt-4 pb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[10px] h-[10px] bg-[#4ADE80] rounded-full border-2 border-[#bbf7d0]"></div>
            <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Create Assignment</h1>
          </div>
          <p className="text-[13px] text-gray-400 font-medium mt-1 ml-6">Set up a new assignment for your students</p>
        </div>

        <div className="flex w-full h-1.5 rounded-full overflow-hidden mb-8 max-w-4xl mx-auto">
          <div className="w-1/2 bg-gray-500"></div>
          <div className="w-1/2 bg-gray-200"></div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] max-w-4xl mx-auto mb-6 relative z-10">
          <h2 className="text-[18px] font-bold text-gray-900 mb-1">Assignment Details</h2>
          <p className="text-[13px] text-gray-400 font-medium mb-8">Basic information about your assignment</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-3">Title <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. Electricity Quiz" required
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-3">Subject <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. Physics" required
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-3">Grade <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. 10th" required
                value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-gray-900 mb-3">Board</label>
              <select 
                value={formData.board} onChange={e => setFormData({...formData, board: e.target.value})}
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium outline-none focus:border-gray-300">
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State">State</option>
                <option value="IB">IB</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[14px] font-bold text-gray-900 mb-3">Due Date</label>
              <div className="relative flex items-center">
                <input type="date"
                  value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3 text-[14px] font-medium outline-none focus:border-gray-300 text-gray-500 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10 h-[50px]"
                />
                <span className="material-symbols-rounded absolute right-5 text-gray-700 pointer-events-none text-[22px]">calendar_add_on</span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#FAFAFA] mb-2 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="material-symbols-rounded text-3xl text-gray-600 mb-3">cloud_upload</span>
            <span className="text-[15px] font-bold text-gray-800 mb-1">{file ? file.name : 'Choose a file or drag & drop it here'}</span>
            <span className="text-[13px] text-gray-400 font-medium mb-4">PDF, TXT, upto 5MB</span>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors pointer-events-none">
              Browse Files
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt" onChange={handleFileChange} />
          </div>
          <p className="text-[13px] text-gray-400 font-medium text-center mb-8">Upload syllabus or context material</p>



          <div className="mb-8">
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-7"><label className="text-[14px] font-bold text-gray-900">Question Type</label></div>
              <div className="col-span-3 text-center"><label className="text-[14px] font-bold text-gray-900">No. of Questions</label></div>
              <div className="col-span-2 text-center pr-8"><label className="text-[14px] font-bold text-gray-900">Marks</label></div>
            </div>

            <div className="flex flex-col gap-4">
              {questionTypes.map((qt, idx) => (
                <div key={idx} className="bg-white md:bg-transparent rounded-2xl md:rounded-none p-5 md:p-0 shadow-[0_2px_15px_rgba(0,0,0,0.03)] md:shadow-none border border-gray-100 md:border-none relative">
                  
                  {/* Mobile close button */}
                  <button onClick={() => handleRemoveQuestionType(idx)} className="absolute right-4 top-4 md:hidden text-gray-400 hover:text-red-500 p-1 z-10">
                    <span className="material-symbols-rounded text-[18px]">close</span>
                  </button>
                  
                  {/* Mobile Title (hidden on desktop) */}
                  <label className="md:hidden block text-[13px] font-bold text-gray-900 mb-2">Question Type</label>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:items-center">
                    <div className="md:col-span-7 relative flex items-center md:pr-8">
                      <select 
                        value={qt.type}
                        onChange={e => updateQuestionType(idx, 'type', e.target.value)}
                        className="appearance-none w-full bg-[#FAFAFA] border border-gray-200 rounded-full px-5 py-3 text-[14px] font-medium outline-none focus:border-gray-300 text-gray-700 md:pr-10">
                        <option value="MCQ">Multiple Choice Questions</option>
                        <option value="ShortAnswer">Short Questions</option>
                        <option value="LongAnswer">Long Answer</option>
                        <option value="TrueFalse">True / False</option>
                        <option value="FillBlank">Fill in the Blanks</option>
                      </select>
                      <span className="material-symbols-rounded absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">expand_more</span>
                      <button onClick={() => handleRemoveQuestionType(idx)} className="absolute right-0 text-gray-400 hover:text-red-500 p-1 hidden md:block">
                        <span className="material-symbols-rounded text-[18px]">close</span>
                      </button>
                    </div>
                    
                    <div className="bg-[#FAFAFA] md:bg-transparent rounded-xl p-3 md:p-0 mt-2 md:mt-0 md:col-span-5 grid grid-cols-2 gap-4 md:gap-0 md:grid-cols-5">
                      
                      <div className="flex flex-col md:flex-row md:col-span-3 items-center md:justify-center gap-2 md:gap-0">
                        <label className="md:hidden text-[11px] font-bold text-gray-600 text-center w-full">No. of Questions</label>
                        <div className="flex items-center justify-between w-full md:w-24 bg-white md:bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5 shadow-sm md:shadow-none">
                          <button onClick={() => updateQuestionType(idx, 'count', Math.max(1, qt.count - 1))} className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                          <span className="text-[14px] font-bold text-gray-900">{qt.count}</span>
                          <button onClick={() => updateQuestionType(idx, 'count', qt.count + 1)} className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:col-span-2 items-center md:justify-center gap-2 md:gap-0 md:pr-8">
                        <label className="md:hidden text-[11px] font-bold text-gray-600 text-center w-full">Marks</label>
                        <div className="flex items-center justify-between w-full md:w-24 bg-white md:bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5 shadow-sm md:shadow-none">
                          <button onClick={() => updateQuestionType(idx, 'marksEach', Math.max(1, qt.marksEach - 1))} className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                          <span className="text-[14px] font-bold text-gray-900">{qt.marksEach}</span>
                          <button onClick={() => updateQuestionType(idx, 'marksEach', qt.marksEach + 1)} className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleAddQuestionType} className="flex items-center gap-3 bg-transparent border-none cursor-pointer group mt-2">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-black transition-colors">
                <span className="material-symbols-rounded text-white text-[16px]">add</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900">Add Question Type</span>
            </button>

            <div className="flex flex-col items-end mt-6 gap-2">
              <div className="text-[14px] font-medium text-gray-900">Total Questions : <span className="font-bold">{totalQuestions}</span></div>
              <div className="text-[14px] font-medium text-gray-900">Total Marks : <span className="font-bold">{totalMarks}</span></div>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[14px] font-bold text-gray-900 mb-3">Additional Information (For better output)</label>
            <div className="relative">
              <textarea
                value={formData.additionalInstructions}
                onChange={e => setFormData({...formData, additionalInstructions: e.target.value})}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                className="w-full h-32 bg-[#FAFAFA] border border-dashed border-gray-200 rounded-2xl p-5 text-[14px] font-medium outline-none focus:border-gray-300 placeholder:text-gray-400 resize-none"
              ></textarea>
              <button className="absolute bottom-4 right-4 bg-white shadow-sm border border-gray-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <span className="material-symbols-rounded text-[18px] text-gray-600">mic</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Next/Prev Buttons (Scrolls with content) */}
        <div className="md:hidden mt-8 mb-4 flex justify-center items-end gap-4 pointer-events-auto">
          <Link href="/" className="bg-white text-gray-900 border-none rounded-full py-3.5 px-6 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-50 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.05)] no-underline">
            <span className="material-symbols-rounded text-[20px]">arrow_back</span>
            Previous
          </Link>
          <button 
            disabled={loading}
            onClick={handleSubmit} 
            className="bg-[#1A1C20] disabled:bg-gray-500 text-white border-none rounded-full py-3.5 px-8 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-black active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            {loading ? 'Creating...' : 'Next'}
            <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
          </button>
        </div>

        <BottomNav isInline={true} />
      </div>

      {/* Desktop Next/Prev Buttons (Sticky at bottom) */}
      <div className="hidden md:flex absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#DADADA] via-[#DADADA]/90 to-transparent pointer-events-none justify-center pb-8 z-20">
        <div className="w-full max-w-4xl px-0 flex justify-between items-end pointer-events-auto">
          <Link href="/" className="bg-white text-gray-900 border-none rounded-full py-3.5 px-6 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-50 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.05)] no-underline">
            <span className="material-symbols-rounded text-[20px]">arrow_back</span>
            Previous
          </Link>
          <button 
            disabled={loading}
            onClick={handleSubmit} 
            className="bg-[#1A1C20] disabled:bg-gray-500 text-white border-none rounded-full py-3.5 px-8 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-black active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            {loading ? 'Creating...' : 'Next'}
            <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
