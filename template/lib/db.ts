const Pool = require("pg").Pool;

const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

export async function exeQuery(query: string, values: (string | number)[]) {
  return (async () => {
    const client = await db.connect();
    try {
      const res = await client.query(query, values);
      return res.rows;
    } finally {
      // Make sure to release the client before any error handling,
      // just in case the error handling itself throws an error.
      client.release();
    }
  })().catch((err) => {
    return { err };
  });
}
export const server = process.env.APP_DOMAIN;

// try {
//     const results = await db.query(query, values);
//     await db.end();
//     return results;
// } catch (error) {
//     return { error };
// }
// }
