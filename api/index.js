// Vercel serverless entry: runs Express app without listen().
// DB sync is cached between warm invocations.
const { app, sequelize } = require('../server/app');

let syncPromise = null;

function ensureDb() {
  if (!syncPromise) {
    // alter:true creates tables on first deploy (Aiven free included)
    syncPromise = sequelize.sync({ alter: true }).catch((err) => {
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
    res.status(500).json({ error: 'Database unavailable' });
    return;
  }
  return app(req, res);
};
