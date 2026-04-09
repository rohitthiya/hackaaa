// SIP Formula: M = (FV * r) / ((1 + r)^n - 1)
// FV = target amount, r = monthly rate, n = months

export const getRateByRisk = (riskLevel) => {
  const rates = {
    low: 8,
    medium: 12,
    high: 16,
  };
  return rates[riskLevel] ?? 12;
};

export const calculateSIP = (targetAmount, months, annualRate) => {
  const r = annualRate / 100 / 12; // monthly rate
  const n = months;

  if (r === 0) return targetAmount / n;

  const sip = (targetAmount * r) / (Math.pow(1 + r, n) - 1);
  return Math.ceil(sip);
};