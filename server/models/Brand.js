const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.TEXT } // Text because base64 strings can be long
});

module.exports = Brand;
