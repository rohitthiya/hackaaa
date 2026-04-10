import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY exists:", !!process.env.SUPABASE_ANON_KEY);

import app from "./src/app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});