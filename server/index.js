require('dotenv').config();

const { app, sequelize } = require('./app');

// Local / long-running server (Render, Railway, VPS, localhost).
// On Vercel serverless, api/index.js imports app directly and does NOT call listen.
const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  // Never alter by default: repeated alters add duplicate UNIQUE indexes until MySQL
  // hits "max 64 keys". Opt in with DB_ALTER=true only for a deliberate migration.
  const syncOptions = process.env.DB_ALTER === 'true' ? { alter: true } : {};
  sequelize
    .sync(syncOptions)
    .then(() => {
      console.log('Database synced successfully.');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
}

module.exports = app;
