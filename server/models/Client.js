const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: { type: DataTypes.STRING, primaryKey: true },
  
  civility: { type: DataTypes.STRING },
  clientType: { type: DataTypes.STRING },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  lastNameAR: { type: DataTypes.STRING },
  firstNameAR: { type: DataTypes.STRING },
  birthDate: { type: DataTypes.DATEONLY },
  birthPlace: { type: DataTypes.STRING },
  birthPlaceAR: { type: DataTypes.STRING },
  nationality: { type: DataTypes.STRING },
  residenceCity: { type: DataTypes.STRING },

  companyName: { type: DataTypes.STRING },
  companyCity: { type: DataTypes.STRING },
  companyContact: { type: DataTypes.STRING },
  ice: { type: DataTypes.STRING },
  if: { type: DataTypes.STRING },
  companyAddress: { type: DataTypes.STRING },

  nationalId: { type: DataTypes.STRING },
  cnieIssueDate: { type: DataTypes.DATEONLY },
  cnieExpiryDate: { type: DataTypes.DATEONLY },

  phoneNumber: { type: DataTypes.STRING },
  phoneNumber2: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING }, // Still good to have natively
  address: { type: DataTypes.TEXT },
  foreignAddress: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  
  driverLicenseFront: { type: DataTypes.TEXT("long") },
  driverLicenseBack: { type: DataTypes.TEXT("long") },
  idCardFront: { type: DataTypes.TEXT("long") },
  idCardBack: { type: DataTypes.TEXT("long") },
  passportFront: { type: DataTypes.TEXT("long") },
  passportBack: { type: DataTypes.TEXT("long") },

  agencyId: { type: DataTypes.STRING },
  companyId: { type: DataTypes.STRING, allowNull: true },
  archived: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.STRING, defaultValue: 'Actif' }
});

module.exports = Client;
