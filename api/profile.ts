import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const rows = await sql`select payload from profile where id = 1`;
      res.status(200).json(rows[0]?.payload ?? {});
      return;
    }

    if (req.method === 'PUT') {
      const profile = req.body ?? {};
      await sql`
        insert into profile (id, payload) values (1, ${JSON.stringify(profile)})
        on conflict (id) do update set payload = excluded.payload
      `;
      res.status(200).json(profile);
      return;
    }

    res.setHeader('Allow', 'GET, PUT');
    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
}
