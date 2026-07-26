import datetime
from app.services.compliance_service import (
    calculate_due_date,
    calculate_msme_interest,
    calculate_tax_disallowance
)

def test_due_date_calculation():
    # Scenario: Invoice 1 Feb 2026, Agreement terms = 30 days
    invoice_date = datetime.date(2026, 2, 1)
    due_date = calculate_due_date(invoice_date, has_written_agreement=True, agreement_days=30)
    assert due_date == datetime.date(2026, 3, 3)

    # Scenario: Invoice 1 Feb 2026, Agreement terms = 60 days (should cap at 45 days)
    due_date_cap = calculate_due_date(invoice_date, has_written_agreement=True, agreement_days=60)
    assert due_date_cap == datetime.date(2026, 3, 18)  # 1 Feb + 45 days = 18 March (28 days in Feb)

    # Scenario: Invoice 1 Feb 2026, No agreement (should default to 15 days)
    due_date_no_agreement = calculate_due_date(invoice_date, has_written_agreement=False, agreement_days=None)
    assert due_date_no_agreement == datetime.date(2026, 2, 16)  # 1 Feb + 15 days = 16 Feb

def test_msme_interest_calculation():
    # Scenario: Shakti Engineering Works, Principal = 5,00,000
    # Due Date = 3 March 2026, Today = 15 April 2026
    # Delay = 43 Days. Bank rate = 6.75% (Interest Rate = 20.25% p.a.)
    amount = 500000.0
    due_date = datetime.date(2026, 3, 3)
    today_date = datetime.date(2026, 4, 15)
    
    result = calculate_msme_interest(amount, due_date, today_date, bank_rate=0.0675)
    
    assert result["delay_days"] == 43
    assert result["interest_rate_pa"] == 0.2025
    assert result["months_compounded"] == 1
    assert result["fractional_days"] == 12
    
    # Mathematical manual trace:
    # After 1 month (3-Mar to 3-Apr): Compounded amount = 500,000 * (1 + 0.2025/12) = 508,437.5
    # Fractional period (3-Apr to 15-Apr = 12 days): Interest = 508,437.5 * 0.2025 * (12/365) = 3384.88
    # Total Interest = 8437.5 + 3384.88 = 11,822.38
    assert abs(result["interest_accrued"] - 11822.38) < 1.0
    assert abs(result["total_due"] - 511822.38) < 1.0

def test_tax_disallowance():
    # Scenario: Shakti Engineering Works invoice remains unpaid at March 31, 2026
    amount = 500000.0
    due_date = datetime.date(2026, 3, 3)
    
    # Case 1: Unpaid at year-end, should be disallowed
    res_unpaid = calculate_tax_disallowance(
        amount=amount,
        due_date=due_date,
        payment_date=None,
        financial_year_end=datetime.date(2026, 3, 31),
        tax_rate=0.30
    )
    assert res_unpaid["is_disallowed"] is True
    assert res_unpaid["disallowed_amount"] == 500000.0
    assert res_unpaid["tax_loss"] == 150000.0
    
    # Case 2: Paid before year-end (e.g. 20 March 2026)
    res_paid_in_fy = calculate_tax_disallowance(
        amount=amount,
        due_date=due_date,
        payment_date=datetime.date(2026, 3, 20),
        financial_year_end=datetime.date(2026, 3, 31),
        tax_rate=0.30
    )
    assert res_paid_in_fy["is_disallowed"] is False
    assert res_paid_in_fy["tax_loss"] == 0.0
