import { sql, ensureSchema } from "./_db.js";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function clampInt0to5(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  const i = Math.trunc(x);
  if (i < 0 || i > 5) return null;
  return i;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    await ensureSchema();
    const body = JSON.parse(event.body || "{}");

    const name = String(body.name || "").trim();
    const gender = String(body.gender || "").trim();

    const party = clampInt0to5(body.party);
    const early = clampInt0to5(body.early);
    const sporty = clampInt0to5(body.sporty);
    const snore = clampInt0to5(body.snore);

    if (!name) return { statusCode: 400, headers, body: JSON.stringify({ error: "Name is required" }) };
    if (!gender) return { statusCode: 400, headers, body: JSON.stringify({ error: "Gender is required" }) };
    if ([party, early, sporty, snore].some(v => v === null)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Scores must be integers 0..5" }) };
    }

    await sql(
      `insert into registrations (name, gender, party, early, sporty, snore)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (name) do update set
         gender = excluded.gender,
         party  = excluded.party,
         early  = excluded.early,
         sporty = excluded.sporty,
         snore  = excluded.snore`,
      [name, gender, party, early, sporty, snore]
    );

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e?.message || e) }) };
  }
}