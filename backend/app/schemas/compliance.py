from pydantic import BaseModel, Field
import datetime
from typing import List, Optional

class CalculatorRequest(BaseModel):
    amount: float = Field(..., example=500000.0)
    invoice_date: datetime.date = Field(..., example=datetime.date(2026, 2, 1))
    has_written_agreement: bool = Field(default=True)
    agreement_days: Optional[int] = Field(default=30)
    evaluation_date: datetime.date = Field(default=datetime.date(2026, 4, 15))
    bank_rate: float = Field(default=0.0675, description="RBI Bank Rate as a decimal")
    tax_rate: float = Field(default=0.30, description="Corporate Tax Rate as a decimal")

class ComplianceDetail(BaseModel):
    is_disallowed: bool
    disallowed_amount: float
    tax_rate: float
    tax_loss: float
    status: str

class InterestDetail(BaseModel):
    delay_days: int
    interest_rate_pa: float
    interest_accrued: float
    next_projection: float
    total_due: float
    months_compounded: int
    fractional_days: int
    calculation_log: str

class CalculatorResponse(BaseModel):
    amount: float
    invoice_date: datetime.date
    due_date: datetime.date
    evaluation_date: datetime.date
    compliance: ComplianceDetail
    interest: InterestDetail
