"use client";

import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface BloomsChartProps {
  sections: any[];
}

export default function BloomsChart({ sections }: BloomsChartProps) {
  const data = useMemo(() => {
    const counts = {
      remember: 0,
      understand: 0,
      apply: 0,
      analyze: 0,
      evaluate: 0,
      create: 0,
    };

    sections?.forEach(section => {
      section.questions?.forEach((q: any) => {
        if (q.bloomsLevel && counts[q.bloomsLevel as keyof typeof counts] !== undefined) {
          counts[q.bloomsLevel as keyof typeof counts] += q.marks || 1;
        }
      });
    });

    return [
      { subject: 'Remember', A: counts.remember, fullMark: Math.max(...Object.values(counts)) || 10 },
      { subject: 'Understand', A: counts.understand, fullMark: Math.max(...Object.values(counts)) || 10 },
      { subject: 'Apply', A: counts.apply, fullMark: Math.max(...Object.values(counts)) || 10 },
      { subject: 'Analyze', A: counts.analyze, fullMark: Math.max(...Object.values(counts)) || 10 },
      { subject: 'Evaluate', A: counts.evaluate, fullMark: Math.max(...Object.values(counts)) || 10 },
      { subject: 'Create', A: counts.create, fullMark: Math.max(...Object.values(counts)) || 10 },
    ];
  }, [sections]);

  const maxVal = Math.max(...data.map(d => d.A));

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center">
      <h3 className="text-[16px] font-bold text-gray-900 mb-2 self-start">Bloom's Taxonomy Distribution</h3>
      <p className="text-[13px] text-gray-500 mb-6 self-start">Cognitive level breakdown by marks</p>
      
      <div className="w-full h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, maxVal === 0 ? 10 : 'auto']} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#F97316', fontWeight: 600 }}
            />
            <Radar
              name="Marks"
              dataKey="A"
              stroke="#F97316"
              fill="#F97316"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
