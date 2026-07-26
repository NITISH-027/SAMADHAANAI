"use client";

import React, { useState, useEffect } from "react";
import SandboxCalculator from "@/components/sandbox-calculator";
import { ArrowRight, Bot, ShieldAlert, FileText, ChevronRight, HelpCircle, Activity, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Expose guided demo launcher globally
    if (typeof window !== "undefined") {
      (window as any).launchGuidedDemo = () => {
        // Set demo state in localStorage
        localStorage.setItem("samadhaan_demo_step", "ledger_scan");
        router.push("/corporate");
      };
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col">
      {/* Background Gradients & Grid Patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient opacity-80 pointer-events-none" />
      
      {/* Floating decorative glass shapes */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-sm tracking-wider shadow-lg shadow-indigo-500/25">
            SAMADHAAN<span className="text-indigo-200">AI</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
          <a href="#sandbox" className="hover:text-white transition-colors">Compliance Sandbox</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <span className="text-white/20">|</span>
          <span className="text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-indigo-300 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
            Income Tax Section 43B(h)
          </span>
        </nav>
        <button
          onClick={() => (window as any).launchGuidedDemo?.()}
          className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 cursor-pointer shimmer-btn"
        >
          🚀 Launch Guided Demo
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs text-indigo-300 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Compliance Workspace
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Recover MSME Payments. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-purple-400">
              Avoid 43B(h) Penalties.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
            An intelligent workspace that helps corporate finance teams automate Section 43B(h) compliance scans to prevent tax disallowances, while enabling MSMEs to claim compounding interest and file automated facilitation council petitions.
          </p>

          {/* Quick Triggers */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => (window as any).launchGuidedDemo?.()}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm px-6 py-3 rounded-xl transition-all font-bold flex items-center gap-2 shadow-xl shadow-indigo-500/20 cursor-pointer group"
            >
              Start Automated Scan
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="#sandbox"
              className="bg-white/5 hover:bg-white/10 active:bg-white/15 text-gray-300 border border-white/10 text-sm px-6 py-3 rounded-xl transition-all font-semibold flex items-center gap-2"
            >
              Use Calculator
            </Link>
          </div>

          {/* Scale Statistic Bar */}
          <div id="problem" className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5 max-w-md">
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-white block">₹10.7 Lakh Cr</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mt-0.5">Outstanding MSME Payments</span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-white block">63 Million</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mt-0.5">Affected Nationwide</span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-white block">43B(h)</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mt-0.5">Mandatory Tax Compliance</span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-white block">95%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mt-0.5">Less Manual Effort</span>
            </div>
          </div>
        </div>

        {/* Sandbox Calculator Widget */}
        <div id="sandbox" className="lg:col-span-6 w-full relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-15 blur-lg" />
          <SandboxCalculator />
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold">Comprehensive Dual-Channel Intelligence</h2>
          <p className="text-sm text-gray-400">
            SAMADHAANAI bridges the gap between buyers and suppliers, providing customized compliance pipelines for corporate tax managers and registered MSMEs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Corporate card */}
          <div className="glass-panel border-white/5 rounded-2xl p-8 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">For Corporate Finance Teams</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ensure audit readiness and avoid expensive year-end tax adjustments. Automatically run scans on your accounts payable ledgers to flag outstanding MSME dues, map contract parameters, and structure payment prioritizations.
            </p>
            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
                Ledger Scanner & GSTIN Lookup
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
                Section 43B(h) Due Date Mapping
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
                AI-Driven Payment Recommendations
              </li>
            </ul>
          </div>

          {/* Supplier card */}
          <div className="glass-panel border-white/5 rounded-2xl p-8 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">For Registered MSMEs</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enforce payment terms and claim legal compounding interest. Upload invoices for automatic OCR extraction, track delay records, adjust reminder tones, and compile complete dispute filing packages instantly.
            </p>
            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-emerald-400" />
                Gemini OCR Invoice Extraction
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-emerald-400" />
                Compounding Interest Engine (3x Bank Rate)
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-emerald-400" />
                Automated MSME Samadhaan Filing Compilation
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-slate-950/80 relative z-10 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span>© {new Date().getFullYear()} SAMADHAANAI. AI Powered Compliance Platform.</span>
          </div>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
