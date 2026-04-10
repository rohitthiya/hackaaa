export const generateAIPlan = async ({ targetAmount, months, riskLevel, monthlyInvestment, expectedReturn }) => {
  try {
    const prompt = `You are a seasoned financial advisor AI for Indian retail investors. A user wants to reach a goal of ₹${Number(targetAmount).toLocaleString('en-IN')} in ${months} months.

Their investment profile:
- Risk Level: ${riskLevel} (${riskLevel === 'low' ? 'Conservative' : riskLevel === 'medium' ? 'Moderate' : 'Aggressive'})
- Required Monthly SIP: ₹${Number(monthlyInvestment).toLocaleString('en-IN')}
- Expected Annual Return: ${expectedReturn}%

Write a detailed, warm, and practical investment plan structured using exactly these 4 sections. Put each header on its own line exactly as shown:

## Where to Invest
Recommend specific asset classes and instruments suitable for this risk level and timeline. Name popular Indian funds or instruments (e.g. Nifty 50 index funds, PPF, flexi-cap). 2-3 sentences.

## Why This Works for You
Explain why this strategy fits their specific risk profile and goal timeline. Make it personal and reassuring. 2-3 sentences.

## What to Expect
Describe the expected journey — how the corpus will grow, potential short-term volatility, and the final likely outcome. Include realistic expectations. 2-3 sentences.

## Smart Tips
Give 3-4 short, numbered, actionable tips the investor can follow right now to improve their chances of reaching this goal.

Keep the language simple, warm, and encouraging. No jargon. Write for a first-time Indian investor.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5001",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("[aiService] OpenRouter error:", data.error.message);
      return generateFallbackPlan({ targetAmount, months, riskLevel, monthlyInvestment, expectedReturn });
    }

    const content = data.choices?.[0]?.message?.content;
    return content || generateFallbackPlan({ targetAmount, months, riskLevel, monthlyInvestment, expectedReturn });

  } catch (err) {
    console.error("[aiService] AI fetch error:", err.message);
    return generateFallbackPlan({ targetAmount, months, riskLevel, monthlyInvestment, expectedReturn });
  }
};

// ─── Fallback plan when OpenRouter is unavailable ────────────────────────────
function generateFallbackPlan({ targetAmount, months, riskLevel, monthlyInvestment, expectedReturn }) {
  const instrMap = {
    low: 'debt mutual funds, fixed deposits (FDs), and government bonds like PPF or NSC',
    medium: 'a balanced mix of equity mutual funds (60%) and debt funds (40%), such as hybrid or flexi-cap funds',
    high: 'equity mutual funds — specifically small-cap and mid-cap funds — along with direct stocks of fundamentally strong companies',
  };
  const instr = instrMap[riskLevel] || instrMap.medium;
  const fmt = (n) => Number(n).toLocaleString('en-IN');

  return `## Where to Invest
For your ₹${fmt(targetAmount)} goal over ${months} months with a ${riskLevel}-risk appetite, we recommend investing primarily in ${instr}. A monthly SIP of ₹${fmt(monthlyInvestment)} into these instruments will put you firmly on track to achieving your target.

## Why This Works for You
This strategy is well-suited to your ${riskLevel}-risk profile — it balances capital safety with the growth needed to hit your goal at ${expectedReturn}% per annum. By automating a monthly SIP, you also benefit from rupee-cost averaging, which smooths out the impact of market ups and downs over time.

## What to Expect
Over the ${months} months, your corpus will grow gradually — compounding will accelerate returns in the later months, so patience is key. Markets can be volatile in the short term, but staying invested consistently is the single biggest factor in your success. At ${expectedReturn}% p.a., you should comfortably reach ₹${fmt(targetAmount)} by the end of the plan.

## Smart Tips
1. Set up an auto-debit SIP on the 5th of every month so investments happen before you can spend the money.
2. Never pause or withdraw during market dips — historically, those who stay invested recover faster and come out ahead.
3. Review your goal progress every 6 months and consider a 10% step-up in SIP amount as your salary grows.
4. Keep an emergency fund of 3–6 months of expenses in a liquid fund so you never need to break this SIP in a crisis.`;
}