"use client";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useState } from "react";

export default function CreateAssignment() {
  return (
    <DashboardLayout showGridIcon={false}>
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-32 no-scrollbar relative">
        {/* Title Area */}
        <div className="pt-4 pb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[10px] h-[10px] bg-[#4ADE80] rounded-full border-2 border-[#bbf7d0]"></div>
            <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Create Assignment</h1>
          </div>
          <p className="text-[13px] text-gray-400 font-medium mt-1 ml-6">Set up a new assignment for your students</p>
        </div>

        {/* Progress Bar */}
        <div className="flex w-full h-1.5 rounded-full overflow-hidden mb-8 max-w-4xl mx-auto">
          <div className="w-1/2 bg-gray-500"></div>
          <div className="w-1/2 bg-gray-200"></div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.03)] max-w-4xl mx-auto mb-6 relative z-10">
          <h2 className="text-[18px] font-bold text-gray-900 mb-1">Assignment Details</h2>
          <p className="text-[13px] text-gray-400 font-medium mb-8">Basic information about your assignment</p>

          {/* Upload Box */}
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#FAFAFA] mb-2 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="material-symbols-rounded text-3xl text-gray-600 mb-3">cloud_upload</span>
            <span className="text-[15px] font-bold text-gray-800 mb-1">Choose a file or drag & drop it here</span>
            <span className="text-[13px] text-gray-400 font-medium mb-4">JPEG, PNG, upto 10MB</span>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-colors">
              Browse Files
            </button>
          </div>
          <p className="text-[13px] text-gray-400 font-medium text-center mb-8">Upload images of your preferred document/image</p>

          {/* Due Date */}
          <div className="mb-8">
            <label className="block text-[14px] font-bold text-gray-900 mb-3">Due Date</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="DD-MM-YYYY" 
                className="w-full bg-[#FAFAFA] border border-gray-200 rounded-2xl px-5 py-3.5 text-[14px] font-medium outline-none focus:border-gray-300 placeholder:text-gray-400"
              />
              <span className="material-symbols-rounded absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">event</span>
            </div>
          </div>

          {/* Question Types */}
          <div className="mb-8 overflow-x-auto no-scrollbar">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-7">
                  <label className="text-[14px] font-bold text-gray-900">Question Type</label>
                </div>
                <div className="col-span-3 text-center">
                  <label className="text-[14px] font-bold text-gray-900">No. of Questions</label>
                </div>
                <div className="col-span-2 text-center pr-8">
                  <label className="text-[14px] font-bold text-gray-900">Marks</label>
                </div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-12 gap-4 items-center mb-4">
                <div className="col-span-7 relative flex items-center pr-8">
                  <select className="appearance-none w-full bg-[#FAFAFA] border border-gray-200 rounded-full px-5 py-3 text-[14px] font-medium outline-none focus:border-gray-300 text-gray-700">
                    <option>Multiple Choice Questions</option>
                  </select>
                  <span className="material-symbols-rounded absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">expand_more</span>
                  <button className="absolute right-0 text-gray-400 hover:text-gray-600 p-1">
                    <span className="material-symbols-rounded text-[18px]">close</span>
                  </button>
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">4</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center pr-8">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">1</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-12 gap-4 items-center mb-4">
                <div className="col-span-7 relative flex items-center pr-8">
                  <select className="appearance-none w-full bg-[#FAFAFA] border border-gray-200 rounded-full px-5 py-3 text-[14px] font-medium outline-none focus:border-gray-300 text-gray-700">
                    <option>Short Questions</option>
                  </select>
                  <span className="material-symbols-rounded absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">expand_more</span>
                  <button className="absolute right-0 text-gray-400 hover:text-gray-600 p-1">
                    <span className="material-symbols-rounded text-[18px]">close</span>
                  </button>
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">3</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center pr-8">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">2</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-12 gap-4 items-center mb-4">
                <div className="col-span-7 relative flex items-center pr-8">
                  <select className="appearance-none w-full bg-[#FAFAFA] border border-gray-200 rounded-full px-5 py-3 text-[14px] font-medium outline-none focus:border-gray-300 text-gray-700">
                    <option>Diagram/Graph-Based Questions</option>
                  </select>
                  <span className="material-symbols-rounded absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">expand_more</span>
                  <button className="absolute right-0 text-gray-400 hover:text-gray-600 p-1">
                    <span className="material-symbols-rounded text-[18px]">close</span>
                  </button>
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">5</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center pr-8">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">5</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-12 gap-4 items-center mb-6">
                <div className="col-span-7 relative flex items-center pr-8">
                  <select className="appearance-none w-full bg-[#FAFAFA] border border-gray-200 rounded-full px-5 py-3 text-[14px] font-medium outline-none focus:border-gray-300 text-gray-700">
                    <option>Numerical Problems</option>
                  </select>
                  <span className="material-symbols-rounded absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">expand_more</span>
                  <button className="absolute right-0 text-gray-400 hover:text-gray-600 p-1">
                    <span className="material-symbols-rounded text-[18px]">close</span>
                  </button>
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">5</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center pr-8">
                  <div className="flex items-center justify-between w-24 bg-[#FAFAFA] border border-gray-200 rounded-full px-2 py-1.5">
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">−</button>
                    <span className="text-[14px] font-bold text-gray-900">5</span>
                    <button className="text-gray-400 hover:text-gray-600 p-1 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-3 bg-transparent border-none cursor-pointer group mt-2">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-black transition-colors">
                <span className="material-symbols-rounded text-white text-[16px]">add</span>
              </div>
              <span className="text-[13px] font-bold text-gray-900">Add Question Type</span>
            </button>
            
            <div className="flex flex-col items-end mt-6 gap-2">
              <div className="text-[14px] font-medium text-gray-900">Total Questions : <span className="font-bold">25</span></div>
              <div className="text-[14px] font-medium text-gray-900">Total Marks : <span className="font-bold">60</span></div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-2">
            <label className="block text-[14px] font-bold text-gray-900 mb-3">Additional Information (For better output)</label>
            <div className="relative">
              <textarea 
                placeholder="e.g Generate a question paper for 3 hour exam duration..." 
                className="w-full h-32 bg-[#FAFAFA] border border-dashed border-gray-200 rounded-2xl p-5 text-[14px] font-medium outline-none focus:border-gray-300 placeholder:text-gray-400 resize-none"
              ></textarea>
              <button className="absolute bottom-4 right-4 bg-white shadow-sm border border-gray-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <span className="material-symbols-rounded text-[18px] text-gray-600">mic</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer Buttons */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#E5E7EB] md:from-[#DADADA] via-[#E5E7EB]/90 md:via-[#DADADA]/90 to-transparent pointer-events-none flex justify-center pb-6 md:pb-8 z-20">
        <div className="w-full max-w-4xl px-4 md:px-0 flex justify-between items-end pointer-events-auto">
          <Link href="/" className="bg-white text-gray-900 border-none rounded-full py-3.5 px-6 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-50 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.05)] no-underline">
            <span className="material-symbols-rounded text-[20px]">arrow_back</span>
            Previous
          </Link>
          <button className="bg-[#1A1C20] text-white border-none rounded-full py-3.5 px-8 text-[14px] font-semibold flex items-center gap-2 cursor-pointer transition-all hover:bg-black active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            Next
            <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
