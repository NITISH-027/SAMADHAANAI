"use client";

import React, { useState, useEffect } from "react";
import { calculateCompliance, ComplianceResult } from "@/lib/compliance-utils";
import { ArrowRight, HelpCircle, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SandboxCalculator() {
  const [amount, setAmount] = useState<number>(500000);
  const [delayDays, setDelayDays] = useState<number>(43);
  const [hasAgreement, setHasAgreement] = useState<boolean>(true);
  const [agreementDays, setAgreementDays] = useState<number>(30);
  const [taxRate, setTaxRate] = useState<number>(0.30);
  const [bankRate, setBankRate] = useState<number>(0.0675);
  const [result, setResult] = useState<ComplianceResult | null>(null);

  useEffect(() => {
    // Generate dates based on inputs
    // For reference, invoice date is Feb 1, 2026. Evaluation date is Apr 15, 2026 (43 days delay from Mar 3 due date)
    const invoiceDate = "2026-02-01";
    // We adjust today's date dynamically based on delay to match slider
    const invDateObj = new Date(invoiceDate);
    const term = hasAgreement ? Math.min(agreementDays, 45) : 15;
    const dueDateObj = new Date(invDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + term);
    
    const evalDateObj = new Date(dueDateObj);
    evalDateObj.setDate(evalDateObj.getDate() + delayDays);
    const evaluationDate = evalDateObj.toISOString().split("T")[0];

    const res = calculateCompliance(
      amount,
      invoiceDate,
      hasAgreement,
      agreementDays,
      evaluationDate,
      taxRate,
      bankRate
    );
    setResult(res);
  }, [amount, delayDays, hasAgreement, agreementDays, taxRate, bankRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 md:p-8 glass-panel-glow border-white/10 text-white">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Interactive Compliance Sandbox</h3>
          <p className="text-xs text-gray-400">Simulate Section 43B(h) tax disallowance & interest penalties</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders Area */}
        <div className="space-y-6">
          {/* Invoice Amount */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-gray-300">Invoice Principal Amount</label>
              <span className="font-medium text-indigo-400">{formatCurrency(amount)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="50000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>₹50,000</span>
              <span>₹20 Lakhs</span>
            </div>
          </div>

          {/* Delay Days */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-gray-300">Days Delayed Past Due Date</label>
              <span className="font-medium text-indigo-400">{delayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={delayDays}
              onChange={(e) => setDelayDays(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>0 Days (Compliant)</span>
              <span>150 Days</span>
            </div>
          </div>

          {/* Agreement and Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2">
              <label className="block text-xs text-gray-400">Written Agreement</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setHasAgreement(true)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-all ${
                    hasAgreement
                      ? "bg-indigo-600 border-indigo-500 text-white font-medium"
                      : "bg-transparent border-white/10 text-gray-400"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasAgreement(false)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-all ${
                    !hasAgreement
                      ? "bg-indigo-600 border-indigo-500 text-white font-medium"
                      : "bg-transparent border-white/10 text-gray-400"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {hasAgreement && (
              <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Contract Terms</span>
                  <span className="text-indigo-400 font-medium">{agreementDays} Days</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={agreementDays}
                  onChange={(e) => setAgreementDays(Number(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-[9px] text-gray-500 block text-right">Capped at 45 days legally</span>
              </div>
            )}
          </div>

          {/* Settings / Rates */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 block">Corporate Tax Rate</label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-gray-900 border border-white/10 rounded-lg p-1.5 text-xs text-gray-200"
              >
                <option value={0.25}>25% (SME Company)</option>
                <option value={0.30}>30% (Large Corp / Default)</option>
                <option value={0.3494}>34.94% (Highest Surcharge)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 block">RBI Bank Rate</label>
              <select
                value={bankRate}
                onChange={(e) => setBankRate(Number(e.target.value))}
                className="w-full bg-gray-900 border border-white/10 rounded-lg p-1.5 text-xs text-gray-200"
              >
                <option value={0.0675}>6.75% (Current RBI)</option>
                <option value={0.0650}>6.50%</option>
                <option value={0.0700}>7.00%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex flex-col justify-between bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          {/* Background glow effects */}
          {result?.isDisallowed && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full" />
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Compliance Health</span>
                <span className={`text-2xl font-bold ${result?.isDisallowed ? "text-red-400" : "text-emerald-400"}`}>
                  {result?.isDisallowed ? "Critical Risk" : "Fully Compliant"}
                </span>
              </div>
              <div className={`p-2 rounded-lg ${result?.isDisallowed ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                <ShieldAlert className="h-6 w-6" />
              </div>
            </div>

            {/* Statutory Limits Details */}
            <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 text-sm">
              <div>
                <span className="text-xs text-gray-400 block">Statutory Due Date</span>
                <span className="font-semibold text-gray-200">
                  {result ? new Date(result.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                </span>
                <span className="text-[10px] text-gray-500 block">Capped at {hasAgreement ? Math.min(agreementDays, 45) : 15} days</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Delay Period</span>
                <span className={`font-semibold ${result && result.delayDays > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                  {result ? result.delayDays : 0} Days
                </span>
                <span className="text-[10px] text-gray-500 block">Past legal deadline</span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  Tax Disallowance Impact
                  <span className="group relative">
                    <HelpCircle className="h-3.5 w-3.5 text-gray-500 cursor-help" />
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-gray-950 border border-white/10 text-[10px] p-2 rounded shadow-xl text-gray-300 z-10">
                      Under Sec 43B(h), outstanding MSME dues at year-end are disallowed, raising taxable income.
                    </span>
                  </span>
                </span>
                <span className={`font-semibold ${result && result.isDisallowed ? "text-red-400" : "text-gray-300"}`}>
                  {result ? formatCurrency(result.taxLoss) : "₹0"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  MSMED Sec 16 Interest
                  <span className="group relative">
                    <HelpCircle className="h-3.5 w-3.5 text-gray-500 cursor-help" />
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-gray-950 border border-white/10 text-[10px] p-2 rounded shadow-xl text-gray-300 z-10">
                      Compounded interest with monthly rests at 3x RBI bank rate ({bankRate * 3 * 100}% p.a.) on delayed payments.
                    </span>
                  </span>
                </span>
                <span className={`font-semibold ${result && result.interestAccrued > 0 ? "text-amber-400" : "text-gray-300"}`}>
                  {result ? formatCurrency(result.interestAccrued) : "₹0"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20 mb-4">
              <div className="flex justify-between text-xs text-indigo-300 mb-1">
                <span>Total Financial Exposure</span>
                <span className="font-bold text-sm">
                  {result ? formatCurrency((result.isDisallowed ? result.taxLoss : 0) + result.interestAccrued) : "₹0"}
                </span>
              </div>
              <p className="text-[10px] text-indigo-400">Includes interest payable to MSME + additional tax liability.</p>
            </div>

            <button
              onClick={() => {
                // Trigger guided demo launch from global window state
                if (typeof window !== "undefined") {
                  (window as any).launchGuidedDemo?.();
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 group cursor-pointer"
            >
              Launch Guided Demo Scan
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
