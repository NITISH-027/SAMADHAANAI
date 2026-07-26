"use client";

import React, { useState, useEffect } from "react";
import { 
  FileUp, Bot, FileText, CheckCircle2, ChevronRight, Scale, 
  AlertTriangle, Loader2, ArrowRight, Download, Send, Sliders, Mail, MessageSquare
} from "lucide-react";
import Link from "next/link";

const OCR_STEPS = [
  "📁 Invoice Uploaded successfully",
  "🔍 OCR Processing Completed (parsed visual fields)",
  "📜 Payment Clause Identified (30 Days written contract found)",
  "🏦 MSME Status Verified (Micro Enterprise - Shakti Engineering)",
  "📅 Appointed Day Set (3-Mar-2026)",
  "💰 Interest Compounding Active (3x RBI Bank Rate)",
  "✍ AI Legal Notice Formatted",
  "⚖ Smart Petition Package Prepared"
];

const COMPILING_STEPS = [
  "📂 Collecting Invoice...",
  "📦 Collecting Delivery Challan...",
  "💰 Calculating Interest Details...",
  "⚖ Generating Petition Forms...",
  "✍ Formatting PDF Package...",
  "✓ Done"
];

export default function SupplierPortal() {
  const [demoStep, setDemoStep] = useState<string | null>(null);
  
  // OCR state
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrCurrentStep, setOcrCurrentStep] = useState(0);
  const [ocrComplete, setOcrComplete] = useState(false);

  // Tab views or dispute view
  const [showDisputeDetail, setShowDisputeDetail] = useState(false);

  // Notice states
  const [noticeTone, setNoticeTone] = useState<"gentle" | "firm" | "escalation">("firm");
  const [isCompilingFiling, setIsCompilingFiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);
  const [filingComplete, setFilingComplete] = useState(false);

  useEffect(() => {
    const step = localStorage.getItem("samadhaan_demo_step");
    setDemoStep(step);

    if (step && (step === "supplier_dispute" || step === "notice_generator" || step === "samadhaan_filing" || step === "demo_completed")) {
      setShowDisputeDetail(true);
      setOcrComplete(true);
    }
  }, []);

  const triggerStepChange = (nextStep: string) => {
    localStorage.setItem("samadhaan_demo_step", nextStep);
    setDemoStep(nextStep);
    if (typeof window !== "undefined") {
      (window as any).refreshDemoStep?.();
    }
  };

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setInvoiceFile(e.target.files[0]);
      setOcrScanning(true);
      setOcrCurrentStep(0);
    }
  };

  // OCR timeline loop
  useEffect(() => {
    if (!ocrScanning) return;
    const interval = setTimeout(() => {
      if (ocrCurrentStep < OCR_STEPS.length - 1) {
        setOcrCurrentStep((prev) => prev + 1);
      } else {
        setOcrScanning(false);
        setOcrComplete(true);
        setShowDisputeDetail(true);
        triggerStepChange("supplier_dispute");
      }
    }, 1000);
    return () => clearTimeout(interval);
  }, [ocrScanning, ocrCurrentStep]);

  // Compile Samadhaan filing loop
  const startFilingCompile = () => {
    setIsCompilingFiling(true);
    setCompilingStep(0);
    setFilingComplete(false);
    triggerStepChange("samadhaan_filing");
  };

  useEffect(() => {
    if (!isCompilingFiling) return;
    const interval = setTimeout(() => {
      if (compilingStep < COMPILING_STEPS.length - 1) {
        setCompilingStep((prev) => prev + 1);
      } else {
        setIsCompilingFiling(false);
        setFilingComplete(true);
        triggerStepChange("demo_completed");
      }
    }, 1000);
    return () => clearTimeout(interval);
  }, [isCompilingFiling, compilingStep]);

  // Download PDF Notice from fastapi backend
  const downloadNoticePDF = () => {
    // Generate notice query URL
    const url = `http://localhost:8000/api/supplier/download-notice?invoice_number=INV145&tone=${noticeTone}`;
    window.open(url, "_blank");
  };

  // Download Samadhaan petition filing from fastapi backend
  const downloadFilingPDF = () => {
    const url = "http://localhost:8000/api/supplier/download-petition?invoice_number=INV145";
    window.open(url, "_blank");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
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
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2.5 py-0.5 rounded-full font-bold">
            🛠 SUPPLIER PORTAL
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/corporate" 
            onClick={() => triggerStepChange("corporate_dashboard")}
            className="text-xs border border-white/10 hover:bg-white/5 active:bg-white/10 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 font-medium"
          >
            Switch to Corporate Workspace
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full relative z-10">
        {!showDisputeDetail ? (
          <div className="py-12 space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">AI Invoice Extraction Scan</h2>
              <p className="text-xs text-gray-400">Upload your outstanding invoice copy. The Gemini Vision parser extracts invoice parameters, verifies payment clauses, and maps them to Section 16 interest timelines.</p>
            </div>

            <div className="glass-panel border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden">
              {ocrScanning ? (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6">
                  <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                  <h4 className="font-semibold text-lg text-white mb-2">Analyzing Invoice OCR via Gemini Vision</h4>
                  
                  <div className="w-full max-w-md bg-white/5 border border-white/5 rounded-xl p-4 text-left space-y-2">
                    <span className="text-[10px] text-indigo-400 font-bold block uppercase">AI Timeline Scan</span>
                    {OCR_STEPS.slice(0, ocrCurrentStep + 1).map((step, idx) => (
                      <p key={idx} className="text-xs font-mono text-gray-300">
                        {step}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full mb-4 cursor-pointer hover:bg-indigo-500/15">
                    <FileUp className="h-10 w-10" />
                  </div>
                  <h4 className="font-semibold text-lg text-white mb-1">Upload Invoice PDF / Image</h4>
                  <p className="text-xs text-gray-400 max-w-sm mb-6">Drop your client invoice PDF here, or click to choose from your files.</p>
                  
                  <input
                    type="file"
                    id="invoice-file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleInvoiceUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="invoice-file"
                    className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer font-semibold shadow-lg shadow-indigo-500/20"
                  >
                    Select Invoice File
                  </label>
                  
                  <button
                    onClick={() => {
                      setOcrScanning(true);
                      setOcrCurrentStep(OCR_STEPS.length - 1);
                    }}
                    className="mt-6 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                  >
                    Skip and load preseeded Shakti Engineering Works invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Invoice overview & legal timeline */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Extraction & Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Extraction Summary */}
                <div className="glass-panel border-white/5 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h4 className="font-semibold text-xs text-gray-300 uppercase tracking-wider">AI Extraction Status</h4>
                    <span className="text-[9px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-semibold">Gemini Vision OCR</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="text-gray-500">Invoice Number:</div>
                    <div className="text-emerald-400 text-right">✓ INV145</div>
                    <div className="text-gray-500">Invoice Date:</div>
                    <div className="text-emerald-400 text-right">✓ 1-Feb-2026</div>
                    <div className="text-gray-500">Buyer Name:</div>
                    <div className="text-emerald-400 text-right">✓ ABC Mfg Pvt Ltd</div>
                    <div className="text-gray-500">GSTIN matching:</div>
                    <div className="text-emerald-400 text-right">✓ 27ABCDE1234</div>
                    <div className="text-gray-500">Payment Clause:</div>
                    <div className="text-emerald-400 text-right">✓ Contract (30d)</div>
                    <div className="text-gray-500">Invoice Amount:</div>
                    <div className="text-emerald-400 text-right">✓ ₹5,00,000</div>
                  </div>
                </div>

                {/* Dispute Balance */}
                <div className="glass-panel border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-xs text-gray-300 uppercase tracking-wider">Smart Interest Engine</h4>
                    <Scale className="h-4.5 w-4.5 text-emerald-400" />
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-400 block font-medium">Interest Accrued</span>
                    <span className="text-3xl font-black text-amber-400 block">{formatCurrency(9845)}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Calculated as of 15 Apr 2026 (43 days delay)</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-white/5 text-gray-500 font-mono">
                    <span>Next projection:</span>
                    <span className="text-amber-400 font-bold">{formatCurrency(10112)}</span>
                  </div>
                </div>
              </div>

              {/* Visual Legal Timeline Card */}
              <div className="glass-panel border-white/5 rounded-2xl p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-xs text-gray-300 uppercase tracking-wider">Visual Legal Timeline</h4>
                  <p className="text-[10px] text-gray-500">Statutory lifecycle trace under MSMED Section 15 and Income Tax Section 43B(h)</p>
                </div>
                
                {/* Timeline Stepper */}
                <div className="relative pl-6 border-l border-white/10 space-y-6">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 w-4 h-4 bg-slate-900 border border-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">Invoice Issued</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">1-Feb-2026 — Shakti Engineering Works registers invoice INV145 for ₹5,00,000.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 w-4 h-4 bg-slate-900 border border-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">Contract Terms Capped</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">30-Day contract limit applies (under MSMED 45-day statutory cap).</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 w-4 h-4 bg-slate-900 border border-amber-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-amber-400">Legal Due Date Exceeded (Appointed Day)</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">3-Mar-2026 — Payment default occurs. Section 16 interest begins compounding monthly at 20.25% p.a.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 w-4 h-4 bg-slate-900 border border-red-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    </div>
                    <div>
                      <h5 className="font-bold text-red-400">Financial Year Closing (Disallowance Triggered)</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">31-Mar-2026 — Unpaid dues disallowed from business expenses under Section 43B(h). ABC Mfg Pvt Ltd incurs ₹1,50,000 tax penalty.</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1 w-4 h-4 bg-slate-900 border border-indigo-400 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                    </div>
                    <div>
                      <h5 className="font-bold text-indigo-300">Today's Status</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">15-Apr-2026 — 43 Days delayed past due date. Total outstanding balance is ₹5,09,845 (₹5L principal + ₹9.8K interest).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: AI legal assistant notice & filing compilation */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* AI Legal Assistant Notice Panel */}
              <div className="glass-panel border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">AI Legal Assistant</h4>
                    <p className="text-[9px] text-gray-400">Generate legal notifications</p>
                  </div>
                </div>

                {/* Tone Adjuster */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Reminder Tone</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setNoticeTone("gentle");
                        if (demoStep === "notice_generator") triggerStepChange("samadhaan_filing");
                      }}
                      className={`flex-1 text-[10px] py-1 rounded border transition-all cursor-pointer ${
                        noticeTone === "gentle" 
                          ? "bg-indigo-600 border-indigo-500 text-white font-medium" 
                          : "bg-transparent border-white/5 text-gray-400"
                      }`}
                    >
                      Gentle
                    </button>
                    <button
                      onClick={() => {
                        setNoticeTone("firm");
                        if (demoStep === "notice_generator") triggerStepChange("samadhaan_filing");
                      }}
                      className={`flex-1 text-[10px] py-1 rounded border transition-all cursor-pointer ${
                        noticeTone === "firm" 
                          ? "bg-indigo-600 border-indigo-500 text-white font-medium" 
                          : "bg-transparent border-white/5 text-gray-400"
                      }`}
                    >
                      Firm
                    </button>
                    <button
                      onClick={() => {
                        setNoticeTone("escalation");
                        if (demoStep === "notice_generator") triggerStepChange("samadhaan_filing");
                      }}
                      className={`flex-1 text-[10px] py-1 rounded border transition-all cursor-pointer ${
                        noticeTone === "escalation" 
                          ? "bg-indigo-600 border-indigo-500 text-white font-medium" 
                          : "bg-transparent border-white/5 text-gray-400"
                      }`}
                    >
                      Escalation
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={downloadNoticePDF}
                    className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Demand Notice PDF
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => alert("WhatsApp alert sent via mock endpoint (API integration success).")}
                      className="flex items-center justify-center gap-1 border border-white/10 hover:bg-white/5 text-[10px] py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <MessageSquare className="h-3 w-3 text-emerald-400" />
                      Send WhatsApp
                    </button>
                    <button
                      onClick={() => alert("Email notice sent via mock SMTP endpoint.")}
                      className="flex items-center justify-center gap-1 border border-white/10 hover:bg-white/5 text-[10px] py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <Mail className="h-3 w-3 text-indigo-400" />
                      Send Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Smart Dispute Resolution - Samadhaan filing package */}
              <div className="glass-panel border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <Scale className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Smart Dispute Resolution</h4>
                    <p className="text-[9px] text-gray-400">MSME Facilitation Council filing packet</p>
                  </div>
                </div>

                {isCompilingFiling && (
                  <div className="absolute inset-0 bg-slate-950/90 z-10 flex flex-col items-center justify-center p-4">
                    <Loader2 className="h-7 w-7 text-emerald-500 animate-spin mb-2" />
                    <span className="text-[10px] text-gray-300 font-medium">Compiling petition document...</span>
                    
                    <div className="w-full bg-gray-800 rounded-full h-1 mt-3 overflow-hidden max-w-[150px]">
                      <div 
                        className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${((compilingStep + 1) / COMPILING_STEPS.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-gray-500 font-mono mt-1">{COMPILING_STEPS[compilingStep]}</span>
                  </div>
                )}

                {filingComplete ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-emerald-300 block">Filing Package Compiled</span>
                        <p className="text-[9px] text-emerald-400">Annexure A, B, C, D & E are formatted as a single legal PDF package.</p>
                      </div>
                    </div>

                    <button
                      onClick={downloadFilingPDF}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Compiled Petition PDF
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Automatically compiles invoice details, written contract limits, monthly compounding statements, and your Udyam registration into a single verified claim package ready to file on the MSME Samadhaan Portal.
                    </p>
                    <button
                      onClick={startFilingCompile}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      Compile Filing Package
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
