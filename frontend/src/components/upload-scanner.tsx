"use client";

import React, { useState, useEffect } from "react";
import { FileUp, CheckCircle2, Loader2, Play, Terminal, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScannerProps {
  onScanComplete: () => void;
}

const STEPS = [
  "📂 Reading Ledger File...",
  "🔍 Extracting Vendor Profiles...",
  "🏦 Querying Udyam Registry Database...",
  "📅 Calculating Section 43B(h) Due Dates...",
  "⚖ Running Interest Computations...",
  "🚀 Finalizing Compliance Intelligence Report..."
];

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "success" | "warn";
}

export default function UploadScanner({ onScanComplete }: ScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const addLog = (message: string, type: "info" | "success" | "warn" = "info") => {
    setLogs((prev) => [...prev, { time: formatTime(), message, type }]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      addLog(`File loaded: ${selected.name} (${(selected.size / 1024).toFixed(1)} KB)`, "info");
    }
  };

  const startScan = () => {
    if (!file) {
      // Seed a dummy ledger file if they just click scan
      setFile(new File([""], "purchase_ledger_2026.xlsx"));
    }
    setIsScanning(true);
    setCurrentStep(0);
    setLogs([]);
    setIsComplete(false);
  };

  useEffect(() => {
    if (!isScanning) return;

    // Start scanning logs
    if (currentStep === 0) {
      addLog("Initializing AI Compliance Scanner...", "info");
      addLog("Reading Excel sheet structure...", "info");
    } else if (currentStep === 1) {
      addLog("Identified 62 ledger accounts.", "info");
      addLog("Extracting GSTIN & Vendor entities...", "info");
    } else if (currentStep === 2) {
      addLog("Cross-referencing Udyam Database via API mock...", "info");
      addLog("Found 3 micro-enterprises & 1 small-enterprise.", "success");
    } else if (currentStep === 3) {
      addLog("Analyzing payment milestones for Section 43B(h)...", "info");
      addLog("WARNING: Invoice INV145 from Shakti Engineering Works (Micro) has crossed the 30-day term limit on 3-Mar-2026.", "warn");
    } else if (currentStep === 4) {
      addLog("Compounding interest (monthly rests) at 20.25% p.a...", "info");
      addLog("Shakti Engineering Works INV145 interest calculated: ₹9,845.", "success");
    } else if (currentStep === 5) {
      addLog("Formatting Compliance Intelligence report...", "info");
      addLog("Tax exposure set at ₹1,50,000 (30% disallowance rate).", "info");
    }

    const interval = setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsScanning(false);
        setIsComplete(true);
        addLog("AI Compliance scan completed successfully. Report is ready.", "success");
        // Automatically redirect after 1.5 seconds
        setTimeout(() => {
          onScanComplete();
        }, 1500);
      }
    }, 1200);

    return () => clearTimeout(interval);
  }, [isScanning, currentStep]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
      {/* Upload Drag & Drop */}
      <div className="lg:col-span-2 glass-panel border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[350px] relative overflow-hidden">
        {isScanning && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <h4 className="font-semibold text-lg text-white mb-2">Scanning Purchase Ledger</h4>
            
            {/* Step messages */}
            <div className="w-full max-w-md bg-white/5 border border-white/5 rounded-xl p-4 text-left">
              <span className="text-[10px] text-indigo-400 font-bold block uppercase mb-1">Process Progress</span>
              <p className="text-sm font-medium text-gray-200">{STEPS[currentStep]}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={() => onScanComplete()}
              className="mt-6 text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Skip and view results immediately
            </button>
          </div>
        )}

        {isComplete ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="font-semibold text-lg text-white mb-1">Audit Report Generated</h4>
            <p className="text-sm text-gray-400 max-w-sm mb-6">Your ledger compliance scanning is complete. Redirecting to Compliance Intelligence dashboard...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full mb-4 cursor-pointer hover:bg-indigo-500/15 transition-all">
              <FileUp className="h-10 w-10" />
            </div>
            <h4 className="font-semibold text-lg text-white mb-1">Upload Purchase Ledger</h4>
            <p className="text-xs text-gray-400 max-w-sm mb-6">Drag and drop your accounts payable ledger in Excel (.xlsx) or CSV format, or click to choose local file.</p>
            
            <input
              type="file"
              id="ledger-file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <label
                htmlFor="ledger-file"
                className="bg-white/5 hover:bg-white/10 active:bg-white/15 text-white border border-white/10 text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium"
              >
                {file ? "Change Ledger File" : "Choose File"}
              </label>
              
              <button
                onClick={startScan}
                className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/15 cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current" />
                Run AI Scan
              </button>
            </div>
            
            {file && (
              <span className="text-[11px] text-indigo-300 mt-4 font-mono block">
                Selected: {file.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Audit Trail Logs */}
      <div className="glass-panel border-white/10 rounded-2xl p-4 flex flex-col h-[350px] bg-slate-950/40">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5 text-gray-300">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Audit Trace Logs</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] text-gray-400">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-4">
              <p className="text-gray-600">Waiting for ledger scan execution...</p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-1.5 leading-normal">
                <span className="text-gray-500 shrink-0">[{log.time}]</span>
                <span 
                  className={
                    log.type === "success" 
                      ? "text-emerald-400" 
                      : log.type === "warn" 
                        ? "text-red-400" 
                        : "text-gray-300"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
