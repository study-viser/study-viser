import { sql } from '@vercel/postgres'; // or your Neon/Postgres client

async function cleanup() {
  await sql`DELETE FROM users WHERE email = 'stewdent@foo.com'`;
  await sql`DELETE FROM users WHERE email = 'teechar@foo.com'`;
  console.log('Cleanup complete');
}
cleanup();