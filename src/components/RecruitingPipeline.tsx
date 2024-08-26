"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useLocalStorage from '@/hooks/useLocalStorage';

interface Recruit {
  id: number;
  name: string;
  position: string;
  rating: string;
  potential: string;
  state: string;
}

const RecruitingPipeline: React.FC = () => {
  const [allRecruits, setAllRecruits] = useState<Recruit[]>([]);
  const [pipelineData, setPipelineData] = useState<{ state: string; count: number }[]>([]);

  // Load all recruits from localStorage
  useEffect(() => {
    const loadedRecruits: Recruit[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('recruits_')) {
        const yearRecruits = JSON.parse(localStorage.getItem(key) || '[]');
        loadedRecruits.push(...yearRecruits);
      }
    }
    setAllRecruits(loadedRecruits);
  }, []);

  // Process recruit data for visualization
  useEffect(() => {
    const stateCounts: { [key: string]: number } = {};
    allRecruits.forEach(recruit => {
      if (recruit.state) {
        stateCounts[recruit.state] = (stateCounts[recruit.state] || 0) + 1;
      }
    });
    const data = Object.entries(stateCounts).map(([state, count]) => ({ state, count }));
    data.sort((a, b) => b.count - a.count);
    setPipelineData(data);
  }, [allRecruits]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Recruiting Pipeline</h1>

      <Card>
        <CardHeader className="text-xl font-semibold">Recruits by State</CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={pipelineData}>
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitingPipeline;