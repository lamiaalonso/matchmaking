import { neon } from "@netlify/neon";

export const sql = neon();

export async function ensureSchema() {
  await sql(`
    create table if not exists registrations (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      name text not null,
      gender text not null,
      party int not null check (party between 0 and 5),
      early int not null check (early between 0 and 5),
      sporty int not null check (sporty between 0 and 5),
      snore int not null check (snore between 0 and 5)
    );
  `);

  await sql(`
    create unique index if not exists registrations_name_key
    on registrations (name);
  `);
}