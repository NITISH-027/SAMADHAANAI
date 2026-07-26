export interface ComplianceResult {
  amount: number;
  invoiceDate: string;
  dueDate: string;
  evaluationDate: string;
  delayDays: number;
  interestRatePa: number;
  interestAccrued: number;
  nextMonthlyProjection: number;
  totalDue: number;
  isDisallowed: boolean;
  taxLoss: number;
  taxRate: number;
}

export function calculateCompliance(
  amount: number,
  invoiceDateStr: string,
  hasAgreement: boolean,
  agreementDays: number,
  evaluationDateStr: string,
  taxRate: number = 0.30,
  bankRate: number = 0.0675
): ComplianceResult {
  const invDate = new Date(invoiceDateStr);
  const evalDate = new Date(evaluationDateStr);
  
  // Calculate Due Date
  const termDays = hasAgreement ? Math.min(agreementDays, 45) : 15;
  const dueDate = new Date(invDate);
  dueDate.setDate(dueDate.getDate() + termDays);
  
  // Calculate Delay
  const diffTime = evalDate.getTime() - dueDate.getTime();
  const delayDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  
  // Calculate Interest with monthly rests
  const annualRate = bankRate * 3;
  let interestAccrued = 0;
  
  if (delayDays > 0) {
    // Standard calendar compounding:
    // Compound monthly.
    const monthlyRate = annualRate / 12;
    let tempDate = new Date(dueDate);
    let currentPrincipal = amount;
    let monthsCompounded = 0;
    
    while (true) {
      const nextMonthDate = new Date(tempDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      
      if (nextMonthDate.getTime() <= evalDate.getTime()) {
        currentPrincipal *= (1 + monthlyRate);
        tempDate = nextMonthDate;
        monthsCompounded++;
      } else {
        break;
      }
    }
    
    const remTime = evalDate.getTime() - tempDate.getTime();
    const remainingDays = Math.max(0, Math.ceil(remTime / (1000 * 60 * 60 * 24)));
    
    let remainingInterest = 0;
    if (remainingDays > 0) {
      remainingInterest = currentPrincipal * annualRate * (remainingDays / 365.0);
    }
    
    interestAccrued = (currentPrincipal + remainingInterest) - amount;
  }
  
  // Next monthly projection
  const nextMonthRate = annualRate / 12;
  const nextMonthlyProjection = interestAccrued + (amount + interestAccrued) * nextMonthRate;
  
  // Section 43B(h) Tax Disallowance
  // If unpaid as of March 31, 2026, and due date is on or before March 31, 2026
  const fyEnd = new Date("2026-03-31");
  const isDisallowed = (dueDate.getTime() <= fyEnd.getTime()) && (evalDate.getTime() > fyEnd.getTime());
  const taxLoss = isDisallowed ? amount * taxRate : 0;
  
  return {
    amount,
    invoiceDate: invoiceDateStr,
    dueDate: dueDate.toISOString().split('T')[0],
    evaluationDate: evaluationDateStr,
    delayDays,
    interestRatePa: annualRate,
    interestAccrued: Math.round(interestAccrued * 100) / 100,
    nextMonthlyProjection: Math.round(nextMonthlyProjection * 100) / 100,
    totalDue: Math.round((amount + interestAccrued) * 100) / 100,
    isDisallowed,
    taxLoss: Math.round(taxLoss * 100) / 100,
    taxRate
  };
}
