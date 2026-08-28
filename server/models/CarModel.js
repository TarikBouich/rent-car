const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CarModel = sequelize.define('CarModel', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING }, // Berline, SUV, Citadine, etc.
  brandId: { type: DataTypes.STRING, allowNull: false } // Foreign key
});

module.exports = CarModel;
