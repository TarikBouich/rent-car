const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  planId: {
    type: DataTypes.STRING,
    defaultValue: 'demo'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
});

module.exports = Company;
