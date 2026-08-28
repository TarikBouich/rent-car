const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },

  // Identifiants
  licensePlate:  { type: DataTypes.STRING, allowNull: false },
  chassisNumber: { type: DataTypes.STRING },
  matriculeWWW:  { type: DataTypes.STRING },

  // Brand / Model
  brandId: { type: DataTypes.STRING, allowNull: false },
  modelId: { type: DataTypes.STRING, allowNull: false },

  // General info
  year:            { type: DataTypes.INTEGER },
  circulationDate: { type: DataTypes.DATEONLY },
  seats:           { type: DataTypes.INTEGER, defaultValue: 5 },
  color:           { type: DataTypes.STRING },
  fuelType:        { type: DataTypes.STRING }, // Diesel, Essence, Hybride, Electrique
  transmission:    { type: DataTypes.STRING }, // manual / automatic
  category:        { type: DataTypes.STRING },
  observation:     { type: DataTypes.TEXT },

  // Pricing
  pricePerDay: { type: DataTypes.FLOAT },

  // Agency / status
  agencyId: { type: DataTypes.STRING },
  status:   { type: DataTypes.STRING, defaultValue: 'Available' },

  // Images
  image:  { type: DataTypes.TEXT }, // primary image base64
  images: { type: DataTypes.JSON }, // gallery array

  // Mileage & maintenance
  currentMileage:      { type: DataTypes.INTEGER, defaultValue: 0 },
  oilMileage:          { type: DataTypes.INTEGER, defaultValue: 10000 }, // oil change interval km
  averageMileagePerDay: { type: DataTypes.INTEGER, defaultValue: 0 },
  needsVidange:        { type: DataTypes.BOOLEAN, defaultValue: false },
  lastVidangeKm:       { type: DataTypes.INTEGER },
  nextVidangeKm:       { type: DataTypes.INTEGER },

  // Date expirations
  visiteTechniqueEndDate: { type: DataTypes.DATEONLY },
  assuranceEndDate:       { type: DataTypes.DATEONLY },
  autorisationEndDate:    { type: DataTypes.DATEONLY },

  // Equipments & extras
  equipments: { type: DataTypes.JSON }, // { climatisation, cric, documents, extincteur }
  options:    { type: DataTypes.JSON }, // GPS, etc.
  damages:    { type: DataTypes.JSON }, // CarDamageMap data

  // Sale info
  buyerName:          { type: DataTypes.STRING },
  salePrice:          { type: DataTypes.FLOAT },
  saleDate:           { type: DataTypes.DATEONLY },
  withdrawalAuthDate: { type: DataTypes.DATEONLY },
  buyerCneFront:      { type: DataTypes.TEXT },
  buyerCneBack:       { type: DataTypes.TEXT },
  withdrawalAuthFile: { type: DataTypes.TEXT },
  roulageFile:        { type: DataTypes.TEXT },

  // Credit purchase
  isCreditPurchase:     { type: DataTypes.BOOLEAN, defaultValue: false },
  initialAdvance:       { type: DataTypes.FLOAT, defaultValue: 0 },
  advanceMethod:        { type: DataTypes.STRING },
  monthlyTraite:        { type: DataTypes.FLOAT, defaultValue: 0 },
  traiteDuration:       { type: DataTypes.INTEGER, defaultValue: 0 },
  creditStartDate:      { type: DataTypes.DATEONLY },

  // Multi-tenant
  companyId: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Car;
