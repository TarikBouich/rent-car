// Vercel serverless entry: runs Express app without listen().
// DB sync is cached between warm invocations.
// Local/dev only: load server/.env when present. On Vercel this file is not
// deployed, so the real Environment Variables are used instead.
try {
  require('dotenv').config({ path: require('path').join(__dirname, '..', 'server', '.env') });
} catch {
  /* dotenv unavailable: rely on process.env */
}
// Explicit mysql2 require: sequelize loads dialect dynamically,
// Vercel NFT bundler misses it otherwise -> "Please install mysql2 manually".
require('mysql2');
const { app, sequelize } = require('../server/app');

let syncPromise = null;

function ensureDb() {
  if (!syncPromise) {
    // Never use alter:true by default: on serverless it runs on every cold start and
    // repeatedly adds duplicate UNIQUE indexes until MySQL errors (ER_TOO_MANY_KEYS).
    // Opt in with DB_ALTER=true only for a deliberate schema migration.
    const options = process.env.DB_ALTER === 'true' ? { alter: true } : {};
    syncPromise = sequelize.sync(options).catch((err) => {
      console.error('DB sync failed:', err);
      syncPromise = null; // retry on next invocation
      throw err;
    });
  }
  return syncPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureDb();
  } catch (e) {
    // Expose only a machine code (no host/user/password) to make DB failures diagnosable.
    const code = e?.parent?.code || e?.original?.code || e?.code || e?.name || 'UNKNOWN';
    console.error('DB unavailable:', code, e?.message);
    res.status(500).json({ error: 'Database unavailable', code });
    return;
  }
  return app(req, res);
};
