import dotenv from "dotenv";
dotenv.config();

async function test() {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5000",
    },
    body: JSON.stringify({
      model: "openrouter/auto",
      messages: [{ role: "user", content: "Say hello" }],
    }),
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();