const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AppState = sequelize.define('AppState', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'key']
    }
  ]
});

module.exports = AppState;
