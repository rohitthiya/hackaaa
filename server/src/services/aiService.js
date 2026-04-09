export const generateAIPlan = async ({ targetAmount, months, riskLevel, monthlyInvestment, expectedReturn }) => {
  try {
    const prompt = `
You are a financial advisor AI. A user wants to invest to reach ₹${targetAmount} in ${months} months.
Risk level: ${riskLevel}. Required monthly SIP: ₹${monthlyInvestment}. Expected annual return: ${expectedReturn}%.

Give a beginner-friendly investment plan that includes:
1. Where to invest (stocks, mutual funds, FD, etc.)
2. Why this strategy fits their risk level
3. Expected outcomes
4. Simple tips for a first-time investor
Keep it concise, warm, and practical.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter raw response:", JSON.stringify(data)); // for debugging
    
    if (data.error) {
      console.error("OpenRouter error:", data.error.message);
      return "Could not generate AI plan.";
    }

    return data.choices?.[0]?.message?.content ?? "Could not generate AI plan.";

  } catch (err) {
    console.error("AI fetch error:", err.message);
    return "Could not generate AI plan.";
  }
};