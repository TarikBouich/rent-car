const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agency = sequelize.define('Agency', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  ville: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  if: { type: DataTypes.STRING },
  rc: { type: DataTypes.STRING },
  patente: { type: DataTypes.STRING },
  ice: { type: DataTypes.STRING },
  gerantId: { type: DataTypes.STRING, allowNull: true },
  documents: { type: DataTypes.JSON },
  initialEspece: { type: DataTypes.FLOAT, defaultValue: 0 },
  initialBanque: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
});

module.exports = Agency;
