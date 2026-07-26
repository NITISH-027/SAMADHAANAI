"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, User, Send, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

const PRESETS = [
  { text: "Which invoices need immediate payment?", id: "immediate" },
  { text: "Explain the compliance risk for Shakti Engineering.", id: "risk" },
  { text: "Summarize today's financial impact.", id: "impact" },
  { text: "Draft a professional payment notification email.", id: "email" },
  { text: "Generate an auditor-ready explanation.", id: "audit" },
];

const PRESET_RESPONSES: Record<string, string> = {
  immediate: `Based on Section 43B(h), you should prioritize **Invoice INV145** to **Shakti Engineering Works** immediately. 
  
* **Invoice Amount:** ₹5,00,000
* **Days Delayed:** 43 Days
* **Status:** Outstanding since 3-Mar-2026

**Why?** This invoice has crossed the 30-day contractual limit (under the 45-day legal cap). Since it remained unpaid past March 31, 2026, it is **disallowed** from your business expenses, triggering an immediate tax liability of **₹1,50,000**. Paying it today halts the monthly compounding interest accruing at **20.25% p.a.**`,
  
  risk: `**Shakti Engineering Works (Invoice INV145)** is flagged as **Critical Risk (94/100 Health)** due to the following criteria:

1. **Enterprise Status:** Registered as a **Micro Enterprise** under Udyam Registry.
2. **Statutory Time Limit:** 30 Days (from contract). Legal due date was **3-Mar-2026** (1-Feb-2026 + 30 Days).
3. **FY Cut-off Violation:** Unpaid as of **31-Mar-2026**, triggering Section 43B(h) disallowance.
4. **Current Status:** 43 Days delayed as of today (15-Apr-2026).
5. **Ongoing Accruals:** Interest is accumulating at 3x the RBI Bank Rate (20.25% p.a.), compounded monthly. Currently, **₹9,845** has accrued.`,

  impact: `Here is today's financial impact summary for **ABC Manufacturing Pvt Ltd**:

* **Total Outstanding Dues:** ₹5,00,000 (1 MSME Vendor)
* **Total Disallowed Expenses (Sec 43B(h)):** ₹5,00,000
* **Additional Corporate Tax Liability:** ₹1,50,000 (calculated at 30% tax rate)
* **Statutory MSMED Interest Accrued:** ₹9,845
* **Current Portfolio Compliance Health:** **94 / 100** (Excellent)

*Recommendation:* Clear the outstanding ₹5,00,000 principal today. This recovers your compliance score to **100/100** and avoids further interest penalties.`,

  email: `Here is the AI-generated email template for **Shakti Engineering Works**:

\`\`\`html
Subject: Notice of Payment Processing - Invoice INV145 - ABC Manufacturing Pvt Ltd

Dear Team,

We are writing to inform you that payment for Invoice No. INV145 (Amount: INR 5,00,000), dated 1 February 2026, has been initiated by our finance department.

The payment is being processed along with the statutory interest of INR 9,845 calculated under Section 16 of the MSMED Act, 2006 for the 43 days of delay. The total amount of INR 5,09,845 will reflect in your registered bank account within the next 24 hours.

We value our partnership with Shakti Engineering Works and regret this delay. Thank you for your continued cooperation.

Sincerely,
Rahul Sharma
Finance Manager, ABC Manufacturing Pvt Ltd
\`\`\``,

  audit: `**AUDITOR NOTES - SECTION 43B(h) COMPLIANCE TRACE**
  
* **Assessee Name:** ABC Manufacturing Pvt Ltd
* **Financial Year:** 2025-26 (Assessment Year 2026-27)
* **Schedules Checked:** Outstanding Creditors Listing (MSME Category)
* **Audit Finding:**
  An outstanding balance of **₹5,00,000** payable to **Shakti Engineering Works** (Micro Enterprise, Udyam No: UDYAM-MH-12-0043810) was found unpaid as of 31-Mar-2026.
  The transaction was governed by a written purchase contract specifying a 30-day payment term. The due date of **3-Mar-2026** was exceeded. 
  
* **Tax Audit Treatment:** 
  Disallowed under Section 43B(h) of the Income Tax Act, 1961. Sum added back to total income in Form 3CD.
  Interest provision of **₹9,845** computed under Section 16 of the MSMED Act is also disallowed under Section 23 of the MSMED Act.`
};

export default function CopilotChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI Compliance Copilot. Ask me anything about your Section 43B(h) exposure, vendor priority list, or statutory calculations.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string, presetId?: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let replyText = "I've scanned the compliance logs but couldn't find specific data for that request. Can you ask about Shakti Engineering or outstanding payment priorities?";
      
      if (presetId && PRESET_RESPONSES[presetId]) {
        replyText = PRESET_RESPONSES[presetId];
      } else {
        // Fallback checks for keywords
        const lower = text.toLowerCase();
        if (lower.includes("shakti") || lower.includes("inv145") || lower.includes("risk")) {
          replyText = PRESET_RESPONSES.risk;
        } else if (lower.includes("pay") || lower.includes("immediate") || lower.includes("priority")) {
          replyText = PRESET_RESPONSES.immediate;
        } else if (lower.includes("tax") || lower.includes("impact") || lower.includes("loss") || lower.includes("exposure")) {
          replyText = PRESET_RESPONSES.impact;
        } else if (lower.includes("email") || lower.includes("draft") || lower.includes("notice")) {
          replyText = PRESET_RESPONSES.email;
        } else if (lower.includes("audit") || lower.includes("explanation") || lower.includes("trace")) {
          replyText = PRESET_RESPONSES.audit;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden glass-panel">
      {/* Copilot Header */}
      <div className="p-4 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Bot className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
              Compliance Copilot
              <span className="bg-indigo-500/25 border border-indigo-500/30 text-[9px] text-indigo-300 px-1.5 py-0.5 rounded-full font-medium">AI Live</span>
            </h4>
            <p className="text-[10px] text-gray-400">Section 43B(h) Legal Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] text-emerald-400 font-medium">Ready</span>
        </div>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[420px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 border ${
                msg.role === "user"
                  ? "bg-slate-800 border-white/10 text-gray-300"
                  : "bg-indigo-950/40 border-indigo-500/20 text-indigo-400"
              }`}
            >
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            
            <div className="space-y-1">
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line border ${
                  msg.role === "user"
                    ? "bg-indigo-600/90 border-indigo-500 text-white"
                    : "bg-slate-950/70 border-white/5 text-gray-300"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[8px] text-gray-500 block px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 mr-auto max-w-[85%]">
            <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 border bg-indigo-950/40 border-indigo-500/20 text-indigo-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-950/70 border border-white/5 p-3 rounded-2xl flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Preset click triggers */}
      <div className="p-3 border-t border-white/5 bg-slate-950/20">
        <span className="text-[9px] text-gray-500 block mb-1.5 uppercase font-semibold">Suggested Prompts</span>
        <div className="flex flex-wrap gap-1.5 max-h-[72px] overflow-y-auto">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSendMessage(preset.text, preset.id)}
              className="text-[10px] bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-gray-300 px-2 py-1 rounded-lg transition-all text-left truncate max-w-full cursor-pointer flex items-center gap-1"
            >
              <MessageSquare className="h-2.5 w-2.5 shrink-0 text-indigo-400" />
              {preset.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input panel */}
      <div className="p-3 border-t border-white/5 bg-slate-950/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about Section 43B(h)..."
            className="flex-1 glass-input rounded-xl px-3 py-2 text-xs"
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
