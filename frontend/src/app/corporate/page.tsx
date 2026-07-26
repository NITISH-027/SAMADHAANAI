"use client";

import React, { useState, useEffect } from "react";
import UploadScanner from "@/components/upload-scanner";
import CopilotChat from "@/components/copilot-chat";
import { ComplianceHealthRadial, AgingAreaChart, TaxLiabilityBarChart } from "@/components/dynamic-charts";
import { 
  Bot, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, 
  HelpCircle, RefreshCw, Layers, Database, FileText, ArrowRight,
  TrendingDown, TrendingUp, Download, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const AP_RECORDS = [
  {
    id: 1,
    invoiceNumber: "INV145",
    supplierName: "Shakti Engineering Works",
    supplierType: "Micro Enterprise",
    udyam: "UDYAM-MH-12-0043810",
    invoiceDate: "2026-02-01",
    amount: 500000,
    dueDate: "2026-03-03",
    delayDays: 43,
    interest: 9845,
    taxRisk: 150000,
    status: "Critical"
  },
  {
    id: 2,
    invoiceNumber: "INV289",
    supplierName: "Apex Logistics Ltd",
    supplierType: "Small Enterprise",
    udyam: "UDYAM-DL-03-0098412",
    invoiceDate: "2026-03-10",
    amount: 250000,
    dueDate: "2026-04-24",
    delayDays: 0,
    interest: 0,
    taxRisk: 0,
    status: "Safe"
  },
  {
    id: 3,
    invoiceNumber: "INV302",
    supplierName: "Vardhaman Packing Pvt Ltd",
    supplierType: "Medium Enterprise",
    udyam: "UDYAM-GJ-08-0056123",
    invoiceDate: "2026-02-20",
    amount: 800000,
    dueDate: "2026-04-06",
    delayDays: 9,
    interest: 1120,
    taxRisk: 0, // Medium enterprises are exempt from 43B(h) disallowance rules (only Micro & Small apply!)
    status: "Warning"
  },
  {
    id: 4,
    invoiceNumber: "INV119",
    supplierName: "Supreme Polymers",
    supplierType: "Micro Enterprise",
    udyam: "UDYAM-TN-11-0021489",
    invoiceDate: "2026-03-15",
    amount: 120000,
    dueDate: "2026-04-30",
    delayDays: 0,
    interest: 0,
    taxRisk: 0,
    status: "Safe"
  }
];

export default function CorporatePortal() {
  const [demoStep, setDemoStep] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedTaxRate, setSelectedTaxRate] = useState(0.30);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"priorities" | "all">("priorities");

  useEffect(() => {
    const step = localStorage.getItem("samadhaan_demo_step");
    setDemoStep(step);
    
    // If not in ledger_scan state, show dashboard by default
    if (step && step !== "ledger_scan") {
      setShowDashboard(true);
    }
  }, []);

  const handleScanComplete = () => {
    setShowDashboard(true);
    localStorage.setItem("samadhaan_demo_step", "corporate_dashboard");
    setDemoStep("corporate_dashboard");
    if (typeof window !== "undefined") {
      (window as any).refreshDemoStep?.();
    }
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaxRate(Number(e.target.value));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const triggerStepChange = (nextStep: string) => {
    localStorage.setItem("samadhaan_demo_step", nextStep);
    setDemoStep(nextStep);
    if (typeof window !== "undefined") {
      (window as any).refreshDemoStep?.();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      
      {/* Header */}
      <header className="w-full bg-slate-900/60 border-b border-white/5 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-sm tracking-wider text-white">
            SAMADHAAN<span className="text-indigo-400">AI</span>
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono px-2.5 py-0.5 rounded-full font-bold">
            🏢 CORPORATE PORTAL
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/supplier" 
            onClick={() => triggerStepChange("supplier_dashboard")}
            className="text-xs border border-white/10 hover:bg-white/5 active:bg-white/10 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 font-medium"
          >
            Switch to Supplier Workspace
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          
          <button
            onClick={() => {
              setCopilotOpen(!copilotOpen);
              if (demoStep === "corporate_dashboard") {
                triggerStepChange("copilot_chat");
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs px-3.5 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <Bot className="h-4 w-4" />
            AI Copilot
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Workspace body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          {!showDashboard ? (
            <div className="py-12 space-y-6">
              <div className="text-center max-w-lg mx-auto space-y-2 mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">AI AP Compliance Scanner</h2>
                <p className="text-xs text-gray-400">Upload your accounts payable ledger. The compiler checks Udyam databases, identifies Micro/Small suppliers, computes legal limits, and outputs tax risk treatments.</p>
              </div>
              <UploadScanner onScanComplete={handleScanComplete} />
            </div>
          ) : (
            <>
              {/* Summary Widgets Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Score Widget */}
                <div className="glass-panel border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Compliance Health</span>
                    <span className="text-2xl font-extrabold text-white block">94 / 100</span>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Excellent</span>
                  </div>
                  <div className="w-20 h-20">
                    <ComplianceHealthRadial score={94} />
                  </div>
                </div>

                {/* Today's Alerts */}
                <div className="glass-panel border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Compliance Alerts</span>
                  <div className="flex justify-between items-center py-2">
                    <div className="text-center">
                      <span className="text-lg font-bold text-red-400 block">3</span>
                      <span className="text-[9px] text-gray-400">Critical</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="text-center">
                      <span className="text-lg font-bold text-amber-400 block">4</span>
                      <span className="text-[9px] text-gray-400">Warning</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="text-center">
                      <span className="text-lg font-bold text-emerald-400 block">58</span>
                      <span className="text-[9px] text-gray-400">Safe</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">Scanned 10-Jul-2026</span>
                </div>

                {/* Potential Tax disallowance */}
                <div className="glass-panel border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Sec 43B(h) Tax Risk</span>
                    <HelpCircle className="h-3 w-3 text-gray-600 cursor-help" />
                  </div>
                  <div className="py-1">
                    <span className="text-2xl font-black text-red-400 block">
                      {formatCurrency(1500000 * selectedTaxRate)}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">
                      On ₹15,00,000 disallowed expense
                    </span>
                  </div>
                  {/* Tax selector */}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5">
                    <span className="text-[9px] text-gray-500">Tax rate:</span>
                    <select 
                      value={selectedTaxRate} 
                      onChange={handleTaxRateChange}
                      className="bg-transparent border-none text-[9px] text-indigo-400 font-bold p-0 outline-none cursor-pointer"
                    >
                      <option value={0.25} className="bg-slate-900 text-white">25% (SME)</option>
                      <option value={0.30} className="bg-slate-900 text-white">30% (Corp)</option>
                      <option value={0.3494} className="bg-slate-900 text-white">34.94% (Max)</option>
                    </select>
                  </div>
                </div>

                {/* Interest liability */}
                <div className="glass-panel border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Interest Liability</span>
                    <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="py-1">
                    <span className="text-2xl font-extrabold text-amber-400 block">{formatCurrency(9845 + 1120)}</span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Accruing at 20.25% p.a. (3x Bank Rate)</span>
                  </div>
                  <span className="text-[9px] text-gray-500 block">Next compounding: 1-May-2026</span>
                </div>
              </div>

              {/* AI Priority Recommendation banner */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex gap-3">
                  <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-indigo-300">AI Priority Recommendation</h5>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Pay <span className="font-bold text-white">Shakti Engineering Works (INV145 - ₹5,00,000)</span> immediately. Clears <span className="text-red-400 font-semibold">₹1,50,000</span> in tax risk exposure and stops ongoing interest penalties of 20.25% p.a.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => triggerStepChange("copilot_chat")}
                  className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Examine Logic in Copilot
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {/* Middle Row Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aging bucket chart */}
                <div className="glass-panel border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-xs text-gray-300 uppercase tracking-wider">AP Aging Analysis</h4>
                      <p className="text-[10px] text-gray-500">Breakdown of outstanding invoices by statutory delay buckets</p>
                    </div>
                    <span className="text-[10px] border border-white/5 bg-white/5 px-2 py-0.5 rounded text-indigo-400 font-semibold">Section 15 Limits</span>
                  </div>
                  <AgingAreaChart />
                </div>

                {/* Tax saved vs prevented */}
                <div className="glass-panel border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-xs text-gray-300 uppercase tracking-wider">Cumulative Exposure Saved</h4>
                      <p className="text-[10px] text-gray-500">Estimated savings in disallowance penalties & interest accruals</p>
                    </div>
                    <span className="text-[10px] border border-white/5 bg-white/5 px-2 py-0.5 rounded text-indigo-400 font-semibold">Quarterly Progress</span>
                  </div>
                  <TaxLiabilityBarChart />
                </div>
              </div>

              {/* Accounts Payable Listing Table */}
              <div className="glass-panel border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-slate-900/40 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm">Accounts Payable Ledger compliance Scan</h4>
                    <p className="text-[10px] text-gray-400">Scanned ledger records cross-checked with the MSMED registry.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab("priorities")}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeTab === "priorities"
                          ? "bg-indigo-600 border-indigo-500 text-white font-medium"
                          : "bg-transparent border-white/10 text-gray-400"
                      }`}
                    >
                      Prioritized Alert
                    </button>
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        activeTab === "all"
                          ? "bg-indigo-600 border-indigo-500 text-white font-medium"
                          : "bg-transparent border-white/10 text-gray-400"
                      }`}
                    >
                      All AP Records
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-gray-300">
                    <thead>
                      <tr className="bg-slate-900/25 border-b border-white/5 text-gray-400 font-semibold">
                        <th className="p-3">Invoice Number</th>
                        <th className="p-3">Vendor / Entity</th>
                        <th className="p-3">MSME Category</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3">Delay</th>
                        <th className="p-3">Principal Amount</th>
                        <th className="p-3">Accrued Interest</th>
                        <th className="p-3">Sec 43B(h) Risk</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {AP_RECORDS.filter(r => activeTab === "all" || r.status !== "Safe").map((record) => (
                        <tr 
                          key={record.id} 
                          className={`hover:bg-white/5 transition-colors ${
                            record.id === 1 ? "bg-red-500/5 font-medium border-l-2 border-l-red-500" : ""
                          }`}
                        >
                          <td className="p-3 font-mono text-gray-200">{record.invoiceNumber}</td>
                          <td className="p-3">
                            <div>
                              <span className="font-bold text-gray-200">{record.supplierName}</span>
                              <span className="block text-[9px] text-gray-500 font-mono">Udyam No: {record.udyam}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              record.supplierType.includes("Micro") 
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : record.supplierType.includes("Small")
                                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {record.supplierType}
                            </span>
                          </td>
                          <td className="p-3 text-gray-400">{record.dueDate}</td>
                          <td className={`p-3 font-semibold ${record.delayDays > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                            {record.delayDays > 0 ? `${record.delayDays} Days` : "Within terms"}
                          </td>
                          <td className="p-3 font-bold text-gray-200">{formatCurrency(record.amount)}</td>
                          <td className="p-3 text-amber-400 font-mono">{record.interest > 0 ? formatCurrency(record.interest) : "-"}</td>
                          <td className={`p-3 font-bold ${record.taxRisk > 0 ? "text-red-400" : "text-emerald-400"}`}>
                            {record.taxRisk > 0 ? formatCurrency(record.taxRisk) : "Exempt / Cured"}
                          </td>
                          <td className="p-3">
                            {record.id === 1 ? (
                              <button
                                onClick={() => {
                                  // Switch to supplier details
                                  triggerStepChange("supplier_dashboard");
                                  window.location.href = "/supplier";
                                }}
                                className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-[9px] py-1 px-2.5 rounded transition-all cursor-pointer shadow-lg shadow-red-500/10 flex items-center gap-0.5"
                              >
                                Resolve Dispute
                                <ArrowRight className="h-2.5 w-2.5" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-600">Enterprise Block</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar copilot */}
        <AnimatePresence>
          {copilotOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="border-l border-white/5 bg-slate-950/45 h-auto overflow-hidden flex flex-col shrink-0"
            >
              <div className="p-4 h-full">
                <CopilotChat />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
