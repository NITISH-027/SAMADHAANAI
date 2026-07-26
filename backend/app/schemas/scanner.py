from pydantic import BaseModel
import datetime
from typing import List, Optional

class LedgerRecord(BaseModel):
    id: int
    invoice_number: str
    invoice_date: datetime.date
    supplier_name: str
    supplier_gstin: str
    amount: float
    payment_terms_days: int
    has_written_agreement: bool
    payment_status: str  # "Paid", "Unpaid"
    actual_payment_date: Optional[datetime.date] = None
    due_date: datetime.date
    delay_days: int
    msme_type: str  # "Micro", "Small", "Medium", "None"
    interest_accrued: float
    next_interest_projection: float
    tax_loss_risk: float
    compliance_status: str  # "Safe", "Warning", "Critical"

class ScanSummary(BaseModel):
    total_vendors: int
    msme_vendors: int
    critical_alerts: int
    warning_alerts: int
    safe_alerts: int
    total_due_amount: float
    potential_tax_loss: float
    interest_liability: float
    rbi_bank_rate: float
    corporate_tax_rate: float

class ScanResponse(BaseModel):
    summary: ScanSummary
    records: List[LedgerRecord]
