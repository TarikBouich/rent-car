const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Set to console.log to see raw SQL queries
    pool: {
      max: 5, // Aiven Free max_connections=76, keep small
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      // Aiven requires SSL (ssl-mode=REQUIRED). Localhost does not.
      ssl:
        process.env.DB_HOST &&
        process.env.DB_HOST.includes('aivencloud.com')
          ? { require: true, rejectUnauthorized: false }
          : undefined,
    },
    define: {
      timestamps: true, // Automatically track createdAt and updatedAt
      freezeTableName: true // Don't pluralize table names
    }
  }
);

module.exports = sequelize;
