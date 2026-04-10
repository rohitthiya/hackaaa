export const simulateInvestment = ({ amount, duration, investmentType }) => {

    const investmentMap = {
        stocks: { returnRate: 0.12, volatility: 0.2 },
        mutual: { returnRate: 0.10, volatility: 0.1 },
        fd: { returnRate: 0.06, volatility: 0.02 },
        crypto: { returnRate: 0.20, volatility: 0.3 }
    };

    const selected = investmentMap[investmentType];

    if (!selected) {
        throw new Error("Invalid investment type");
    }

    let value = amount;
    let growth = [];

    for (let i = 1; i <= duration; i++) {

        // random market fluctuation
        const random = (Math.random() - 0.5) * selected.volatility;

        // monthly return
        const monthlyReturn = (selected.returnRate / 12) + random;

        // update value
        value = value * (1 + monthlyReturn);

        growth.push({
            month: i,
            value: Math.round(value)
        });
    }

    // risk calculation
    let risk = "Low";
    if (selected.volatility > 0.2) risk = "High";
    else if (selected.volatility > 0.1) risk = "Medium";

    // best & worst case (extra feature 🔥)
    const bestCase = Math.round(value * 1.1);
    const worstCase = Math.round(value * 0.9);

    return {
        initial: amount,
        final: Math.round(value),
        profit: Math.round(value - amount),
        risk,
        bestCase,
        worstCase,
        growth
    };
};