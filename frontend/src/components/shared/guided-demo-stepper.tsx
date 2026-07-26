"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, X, AlertCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  path: string;
  buttonText: string;
  nextStepId: string;
}

const STEPS: Record<string, DemoStep> = {
  ledger_scan: {
    id: "ledger_scan",
    title: "1. AI Compliance Scan",
    description: "Scan your accounts payable ledger. Click 'Run AI Scan' in the upload box to watch the AI verify vendors, validate Udyam statuses, and run compliance math.",
    path: "/corporate",
    buttonText: "Skip Upload & Scan",
    nextStepId: "corporate_dashboard"
  },
  corporate_dashboard: {
    id: "corporate_dashboard",
    title: "2. Compliance Intelligence",
    description: "Explore the Corporate dashboard. Look at the Compliance Health (94/100), alert thresholds, potential tax disallowances (₹1.5L), and interest liabilities.",
    path: "/corporate",
    buttonText: "Open AI Copilot Panel",
    nextStepId: "copilot_chat"
  },
  copilot_chat: {
    id: "copilot_chat",
    title: "3. AI Compliance Copilot",
    description: "Open the Copilot sidebar. Click any suggested prompt (e.g. 'Which invoices need immediate payment?') to query the tax risk and view AI reasoning in plain English.",
    path: "/corporate",
    buttonText: "Proceed to Supplier Portal",
    nextStepId: "supplier_dashboard"
  },
  supplier_dashboard: {
    id: "supplier_dashboard",
    title: "4. Supplier Portal & OCR Scan",
    description: "Switch roles to the Supplier (Shakti Engineering Works). Upload invoice INV145. Drag & drop file to trigger the AI Extraction Timeline & Confidence metrics.",
    path: "/supplier",
    buttonText: "Skip OCR & View Interest",
    nextStepId: "supplier_dispute"
  },
  supplier_dispute: {
    id: "supplier_dispute",
    title: "5. Smart Interest Engine",
    description: "Review the dispute sheet. Watch the legal timeline and check outstanding payments (₹5L) and accrued interest (₹9,845) calculated for 43 days of delay.",
    path: "/supplier",
    buttonText: "Go to Legal Notice Builder",
    nextStepId: "notice_generator"
  },
  notice_generator: {
    id: "notice_generator",
    title: "6. AI Legal Assistant",
    description: "Review notice drafts and tone templates. Adjust sliders to modify text. Click 'Smart Dispute Resolution' on the left to compile the facilitation council petition.",
    path: "/supplier",
    buttonText: "Draft Samadhaan Filing",
    nextStepId: "samadhaan_filing"
  },
  samadhaan_filing: {
    id: "samadhaan_filing",
    title: "7. Smart Dispute Resolution",
    description: "Click 'Download Filing Package' to compile the petition form, interest statements, and Udyam certificate into a single, print-ready PDF packet.",
    path: "/supplier",
    buttonText: "Complete Demo",
    nextStepId: "demo_completed"
  },
  demo_completed: {
    id: "demo_completed",
    title: "🎉 Guided Demo Completed",
    description: "You have completed the full SAMADHAANAI flow. It successfully protects buyers from tax loss and helps suppliers recover outstanding balances.",
    path: "/",
    buttonText: "Restart Guided Demo",
    nextStepId: "ledger_scan"
  }
};

export default function GuidedDemoStepper() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const step = localStorage.getItem("samadhaan_demo_step");
    if (step && STEPS[step]) {
      setCurrentStepId(step);
    }

    // Handle global triggers
    if (typeof window !== "undefined") {
      (window as any).setDemoStep = (stepId: string) => {
        localStorage.setItem("samadhaan_demo_step", stepId);
        setCurrentStepId(stepId);
      };
      (window as any).refreshDemoStep = () => {
        const current = localStorage.getItem("samadhaan_demo_step");
        setCurrentStepId(current);
      };
    }
  }, [pathname]);

  if (!mounted || !currentStepId || !STEPS[currentStepId]) return null;

  const currentStep = STEPS[currentStepId];

  const handleNext = () => {
    const nextStep = STEPS[currentStep.nextStepId];
    if (nextStep) {
      localStorage.setItem("samadhaan_demo_step", nextStep.id);
      setCurrentStepId(nextStep.id);
      if (pathname !== nextStep.path) {
        router.push(nextStep.path);
      }
    }
  };

  const handleClose = () => {
    localStorage.removeItem("samadhaan_demo_step");
    setCurrentStepId(null);
    router.push("/");
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 max-w-xl w-full">
      <div className="glass-panel border-indigo-500/30 rounded-2xl p-4 md:p-5 shadow-2xl shadow-indigo-500/10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative bg-slate-900/90 backdrop-blur-xl">
        {/* Glow board border */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="flex gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl shrink-0 h-fit">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-white flex items-center gap-2">
              {currentStep.title}
              <span className="text-[8px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded-full font-mono font-bold">GUIDED DEMO</span>
            </h5>
            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{currentStep.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleNext}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            {currentStep.buttonText}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={handleClose}
            title="Exit Demo"
            className="p-2 hover:bg-white/10 active:bg-white/15 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
