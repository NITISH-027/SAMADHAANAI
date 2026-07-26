"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Fix hydration issues with recharts
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// 1. Compliance Health Radial Gauge
interface HealthProps {
  score: number;
}
export function ComplianceHealthRadial({ score }: HealthProps) {
  const mounted = useMounted();
  if (!mounted) return <div className="h-48 flex items-center justify-center text-xs text-gray-500">Loading Gauge...</div>;

  const data = [
    { name: "Compliant", value: score, color: "#10b981" },
    { name: "Risk", value: 100 - score, color: "#ef4444" }
  ];

  return (
    <div className="relative h-48 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={75}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill="var(--success)" />
            <Cell fill="rgba(255, 255, 255, 0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute text-center">
        <span className="text-3xl font-extrabold text-white">{score}%</span>
        <span className="block text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Health Score</span>
      </div>
    </div>
  );
}

// 2. Aging Bucket Area Chart
export function AgingAreaChart() {
  const mounted = useMounted();
  
  const data = [
    { name: "0-15 Days", amount: 48, fill: "#10b981" },
    { name: "16-30 Days", amount: 15, fill: "#fbbf24" },
    { name: "31-45 Days", amount: 8, fill: "#f97316" },
    { name: "45+ Days", amount: 3, fill: "#ef4444" }
  ];

  if (!mounted) return <div className="h-48 flex items-center justify-center text-xs text-gray-500">Loading Chart...</div>;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAging" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#4b5563" 
            fontSize={9}
            tickLine={false}
          />
          <YAxis 
            stroke="#4b5563" 
            fontSize={9}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
            labelStyle={{ color: "#fff", fontSize: "10px", fontWeight: "bold" }}
            itemStyle={{ color: "#a5b4fc", fontSize: "10px" }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#6366f1" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAging)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. Tax Liability vs Interest Bar Chart
export function TaxLiabilityBarChart() {
  const mounted = useMounted();

  const data = [
    {
      name: "Q1",
      "Potential Tax Saved": 45000,
      "Interest Prevented": 1200
    },
    {
      name: "Q2",
      "Potential Tax Saved": 95000,
      "Interest Prevented": 3800
    },
    {
      name: "Q3",
      "Potential Tax Saved": 110000,
      "Interest Prevented": 5400
    },
    {
      name: "Q4 (Active)",
      "Potential Tax Saved": 150000,
      "Interest Prevented": 9845
    }
  ];

  if (!mounted) return <div className="h-48 flex items-center justify-center text-xs text-gray-500">Loading Chart...</div>;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            stroke="#4b5563" 
            fontSize={9}
            tickLine={false}
          />
          <YAxis 
            stroke="#4b5563" 
            fontSize={9}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
            labelStyle={{ color: "#fff", fontSize: "10px", fontWeight: "bold" }}
            itemStyle={{ fontSize: "10px" }}
          />
          <Legend 
            wrapperStyle={{ fontSize: "9px", color: "#9ca3af", paddingTop: "5px" }} 
          />
          <Bar dataKey="Potential Tax Saved" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Interest Prevented" fill="#fbbf24" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
