import datetime
from dateutil.relativedelta import relativedelta

def calculate_due_date(invoice_date: datetime.date, has_written_agreement: bool, agreement_days: int | None) -> datetime.date:
    """
    Under Section 15 of MSMED Act:
    - If there is an agreement, due date is within agreed period, but capped at 45 days.
    - If no agreement, due date is 15 days.
    """
    if has_written_agreement and agreement_days is not None:
        effective_days = min(agreement_days, 45)
    else:
        effective_days = 15
    
    return invoice_date + datetime.timedelta(days=effective_days)

def calculate_msme_interest(
    amount: float,
    due_date: datetime.date,
    today_date: datetime.date,
    bank_rate: float = 0.0675
) -> dict:
    """
    Calculates interest under Section 16 of the MSMED Act.
    Rate: 3x Bank Rate.
    Compounding: Monthly compounding (rests).
    
    Returns a dict with:
        - delay_days: Total days of delay
        - interest_rate_pa: Annualized interest rate (3x bank rate)
        - interest_accrued: Compounded interest up to today
        - next_projection: Compounded interest including the next monthly compounding rest
        - total_due: Principal + interest
        - calculation_log: Summary string of the steps
    """
    if today_date <= due_date:
        return {
            "delay_days": 0,
            "interest_rate_pa": bank_rate * 3,
            "interest_accrued": 0.0,
            "next_projection": 0.0,
            "total_due": amount,
            "calculation_log": "No delay. Invoice is within due date."
        }
        
    delay_days = (today_date - due_date).days
    annual_rate = bank_rate * 3
    monthly_rate = annual_rate / 12
    
    # Compound monthly calendar-wise
    current_principal = amount
    temp_date = due_date
    months_compounded = 0
    
    while True:
        # Move forward by 1 calendar month
        next_month_date = temp_date + relativedelta(months=1)
        if next_month_date <= today_date:
            current_principal *= (1 + monthly_rate)
            temp_date = next_month_date
            months_compounded += 1
        else:
            break
            
    # Remaining fractional period in days
    remaining_days = (today_date - temp_date).days
    remaining_interest = 0.0
    if remaining_days > 0:
        # Simple interest for the fractional month based on daily rate
        # using the compounded principal at the start of this fractional month
        remaining_interest = current_principal * annual_rate * (remaining_days / 365.0)
        
    interest_accrued = (current_principal + remaining_interest) - amount
    
    # Calculate next month projection (adding one more full compounding rest)
    next_rest_principal = current_principal * (1 + monthly_rate)
    next_projection = next_rest_principal - amount
    
    return {
        "delay_days": delay_days,
        "interest_rate_pa": annual_rate,
        "interest_accrued": round(interest_accrued, 2),
        "next_projection": round(next_projection, 2),
        "total_due": round(amount + interest_accrued, 2),
        "months_compounded": months_compounded,
        "fractional_days": remaining_days,
        "calculation_log": f"Compounded monthly for {months_compounded} month(s), simple interest for remaining {remaining_days} day(s) at {annual_rate*100:.2f}% p.a."
    }

def calculate_tax_disallowance(
    amount: float,
    due_date: datetime.date,
    payment_date: datetime.date | None,
    financial_year_end: datetime.date = datetime.date(2026, 3, 31),
    tax_rate: float = 0.30
) -> dict:
    """
    Checks if the invoice is disallowed under Section 43B(h).
    If it is unpaid by due date AND remains unpaid at the end of the financial year (March 31st):
    - Disallowance applies: Yes.
    - Tax impact: Disallowed Amount * Corporate Tax Rate.
    """
    # Check if due_date is in or before the FY
    # If payment was not made before due_date, and remained unpaid on March 31
    is_paid = payment_date is not None
    
    # Under 43B(h), if paid within due date, allowed.
    # If paid after due date, but within same FY, allowed in same FY (no disallowance at year end).
    # If unpaid at year end, it is disallowed in that FY, and allowed in the subsequent FY when paid.
    
    is_disallowed = False
    
    if not is_paid:
        # Currently unpaid. If we evaluate after FY end, and it is still unpaid:
        if due_date <= financial_year_end:
            is_disallowed = True
    else:
        # Paid. Was it paid after FY end and it was due in/before the FY?
        if payment_date > financial_year_end and due_date <= financial_year_end:
            is_disallowed = True
            
    disallowed_amount = amount if is_disallowed else 0.0
    tax_loss = disallowed_amount * tax_rate
    
    return {
        "is_disallowed": is_disallowed,
        "disallowed_amount": disallowed_amount,
        "tax_rate": tax_rate,
        "tax_loss": tax_loss,
        "status": "Disallowed (High Risk)" if is_disallowed else "Allowed (Compliant)"
    }
