import { sql, ensureSchema } from "./_db.js";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export async function handler() {
  try {
    await ensureSchema();
    const rows = await sql(`
      select name, gender, party, early, sporty, snore
      from registrations
      order by created_at asc
    `);

    return { statusCode: 200, headers, body: JSON.stringify({ people: rows }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: String(e?.message || e) }) };
  }
}
