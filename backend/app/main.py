import datetime
from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional

from app.core.config import settings
from app.services.compliance_service import (
    calculate_due_date,
    calculate_msme_interest,
    calculate_tax_disallowance
)
from app.services.pdf_service import (
    generate_legal_notice,
    generate_samadhaan_package
)
from app.schemas.compliance import CalculatorRequest, CalculatorResponse, ComplianceDetail, InterestDetail

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs"
)

# Configure CORS for local Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "message": "AI-Powered MSME Payment Compliance & Dispute Resolution Platform API"
    }

# 1. Compliance Calculator Endpoint
@app.post("/api/compliance/calculate", response_model=CalculatorResponse)
def calculate_compliance_endpoint(req: CalculatorRequest):
    due_date = calculate_due_date(
        invoice_date=req.invoice_date,
        has_written_agreement=req.has_written_agreement,
        agreement_days=req.agreement_days
    )
    
    interest = calculate_msme_interest(
        amount=req.amount,
        due_date=due_date,
        today_date=req.evaluation_date,
        bank_rate=req.bank_rate
    )
    
    compliance = calculate_tax_disallowance(
        amount=req.amount,
        due_date=due_date,
        payment_date=None, # Outstanding
        financial_year_end=datetime.date(2026, 3, 31),
        tax_rate=req.tax_rate
    )
    
    return CalculatorResponse(
        amount=req.amount,
        invoice_date=req.invoice_date,
        due_date=due_date,
        evaluation_date=req.evaluation_date,
        compliance=ComplianceDetail(
            is_disallowed=compliance["is_disallowed"],
            disallowed_amount=compliance["disallowed_amount"],
            tax_rate=compliance["tax_rate"],
            tax_loss=compliance["tax_loss"],
            status=compliance["status"]
        ),
        interest=InterestDetail(
            delay_days=interest["delay_days"],
            interest_rate_pa=interest["interest_rate_pa"],
            interest_accrued=interest["interest_accrued"],
            next_projection=interest["next_projection"],
            total_due=interest["total_due"],
            months_compounded=interest["months_compounded"],
            fractional_days=interest["fractional_days"],
            calculation_log=interest["calculation_log"]
        )
    )

# 2. PDF Legal Notice Downloader Endpoint
@app.get("/api/supplier/download-notice")
def download_notice_endpoint(
    invoice_number: str = "INV145",
    tone: str = "firm"
):
    # Pre-seeded scenario details for Shakti Engineering Works
    invoice_data = {
        "invoice_number": invoice_number,
        "invoice_date": datetime.date(2026, 2, 1),
        "amount": 500000.0,
        "due_date": datetime.date(2026, 3, 3),
        "supplier_name": "Shakti Engineering Works",
        "supplier_gstin": "27SGHIJ5678K2Z9",
        "buyer_name": "ABC Manufacturing Pvt Ltd",
        "buyer_gstin": "27ABCDE1234F1Z5",
    }
    
    interest_data = calculate_msme_interest(
        amount=invoice_data["amount"],
        due_date=invoice_data["due_date"],
        today_date=datetime.date(2026, 4, 15),
        bank_rate=settings.DEFAULT_BANK_RATE
    )
    
    pdf_bytes = generate_legal_notice(invoice_data, interest_data)
    
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Legal_Notice_{invoice_number}.pdf"}
    )

# Import io needed for BytesIO inside stream
import io

# 3. PDF Samadhaan Filing Downloader Endpoint
@app.get("/api/supplier/download-petition")
def download_petition_endpoint(
    invoice_number: str = "INV145"
):
    invoice_data = {
        "invoice_number": invoice_number,
        "invoice_date": datetime.date(2026, 2, 1),
        "amount": 500000.0,
        "due_date": datetime.date(2026, 3, 3),
        "supplier_name": "Shakti Engineering Works",
        "supplier_gstin": "27SGHIJ5678K2Z9",
        "supplier_udyam": "UDYAM-MH-12-0043810",
        "buyer_name": "ABC Manufacturing Pvt Ltd",
        "buyer_gstin": "27ABCDE1234F1Z5"
    }
    
    interest_data = calculate_msme_interest(
        amount=invoice_data["amount"],
        due_date=invoice_data["due_date"],
        today_date=datetime.date(2026, 4, 15),
        bank_rate=settings.DEFAULT_BANK_RATE
    )
    
    pdf_bytes = generate_samadhaan_package(invoice_data, interest_data)
    
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=MSME_Samadhaan_Petition_{invoice_number}.pdf"}
    )

# 4. AI Copilot Chat Endpoint
from app.schemas.copilot import ChatRequest, ChatResponse

@app.post("/api/copilot/chat", response_model=ChatResponse)
def copilot_chat_endpoint(req: ChatRequest):
    # Predefined replies matching our hackathon flow.
    # In production, this would call the Gemini API.
    message_lower = req.message.lower()
    
    # If GEMINI_API_KEY is configured in settings, we can run actual LLM completion.
    # Otherwise, fall back immediately to high-quality pre-seeded responses for the Shakti Engineering Works scenario.
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            prompt = f"""
            You are SAMADHAANAI AI Copilot, a tax compliance and MSME payment dispute expert under the Indian Income Tax Act, 1961 (specifically Section 43B(h)) and MSMED Act, 2006.
            
            Answer this query from a Corporate Finance Manager or MSME Supplier:
            "{req.message}"
            
            Keep your response professional, structured, clear, and cite relevant sections (Section 15, 16 of MSMED Act or Section 43B(h) of IT Act).
            """
            response = model.generate_content(prompt)
            return ChatResponse(
                reply=response.text,
                suggested_prompts=["Which invoices need immediate payment?", "Explain this compliance risk."]
            )
        except Exception as e:
            # Fallback to local rule-based responses if API call fails
            pass
            
    # Mock responses for Guided Demo Mode
    if "immediate" in message_lower or "pay today" in message_lower:
        reply = (
            "Based on Section 43B(h), you should prioritize paying **Shakti Engineering Works (INV145)** today. "
            "It has been delayed by 43 days. Paying it immediately avoids an addition of ₹5,00,000 to your taxable income (saving ₹1,50,000 in taxes at a 30% rate) and halts the monthly compounding interest accruing at 20.25% p.a."
        )
    elif "shakti" in message_lower or "risk" in message_lower or "inv145" in message_lower:
        reply = (
            "Invoice INV145 from Shakti Engineering Works (Micro Enterprise) is marked as **Critical Risk**. "
            "Due Date was 3-Mar-2026. Because it remained unpaid past 31-Mar-2026, the ₹5,00,000 principal is disallowed under Section 43B(h) for FY 2025-26. "
            "Additionally, statutory compounding interest of ₹9,845 has accrued as of 15-Apr-2026."
        )
    elif "impact" in message_lower or "summary" in message_lower or "total" in message_lower:
        reply = (
            "Total outstanding MSME liabilities: ₹5,00,000. Total Section 43B(h) disallowance tax exposure: ₹1,50,000. "
            "Statutory MSME interest liability: ₹9,845. Compliance Health is at **94 / 100**."
        )
    else:
        reply = (
            "I am the SAMADHAANAI AI Copilot. You can ask me to: \n"
            "- List invoices needing immediate payment\n"
            "- Explain the compliance risk of Shakti Engineering\n"
            "- Summarize today's financial tax and interest impact"
        )
        
    return ChatResponse(
        reply=reply,
        suggested_prompts=[
            "Which invoices need immediate payment?",
            "Explain the compliance risk for Shakti Engineering.",
            "Summarize today's financial impact."
        ]
    )

