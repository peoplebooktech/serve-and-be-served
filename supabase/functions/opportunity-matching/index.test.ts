import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

Deno.test("opportunity-matching returns 401 without auth", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/opportunity-matching`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
    },
  });
  const body = await response.json();
  assertEquals(response.status, 401);
  assertEquals(body.error, "Unauthorized");
});

Deno.test("opportunity-matching handles OPTIONS (CORS)", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/opportunity-matching`, {
    method: "OPTIONS",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
    },
  });
  await response.text();
  assertEquals(response.status, 200);
});
