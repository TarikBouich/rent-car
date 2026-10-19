const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Persistent store for the public contract-signature links.
// No time-based expiry: a link stays valid until the client signs it
// (status becomes 'signed') or the agency deletes the session after saving.
const SignatureSession = sequelize.define('SignatureSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  pin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
  dataUrl: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  }
});

module.exports = SignatureSession;
