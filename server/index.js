require('dotenv').config();

const { app, sequelize } = require('./app');

// Local / long-running server (Render, Railway, VPS, localhost).
// On Vercel serverless, api/index.js imports app directly and does NOT call listen.
const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  sequelize
    .sync({ alter: true }) // alter: true will automatically update tables to match models without dropping them
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
