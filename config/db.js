import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "ep-gentle-forest-ax5q49m4-pooler.c-4.us-east-2.aws.neon.tech",
  user: "neondb_owner",
  password: "npg_gDbcFG5N9mSk",
  database: "neondb",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  channelBinding: "require",
});

export const dbController = {
  pool: pool,
};

export const query = async (text, params = []) => {
  const client = await dbController.pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};
