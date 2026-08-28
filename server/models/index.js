const sequelize = require('../config/database');

const Company = require('./Company');
const User = require('./User');
const Car = require('./Car');
const Client = require('./Client');
const Agency = require('./Agency');
const Contrat = require('./Contrat');
const Brand = require('./Brand');
const CarModel = require('./CarModel');
const AppState = require('./AppState');
const Facture = require('./Facture');

// Define Relationships
// A Company has many of all these entities (Multi-Tenant Strategy)
Company.hasMany(User, { foreignKey: 'companyId' });
User.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Car, { foreignKey: 'companyId' });
Car.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Client, { foreignKey: 'companyId' });
Client.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Agency, { foreignKey: 'companyId' });
Agency.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Contrat, { foreignKey: 'companyId' });
Contrat.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(AppState, { foreignKey: 'companyId' });
AppState.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Facture, { foreignKey: 'companyId' });
Facture.belongsTo(Company, { foreignKey: 'companyId' });

// Brand/Model Relationships
Brand.hasMany(CarModel, { foreignKey: 'brandId' });
CarModel.belongsTo(Brand, { foreignKey: 'brandId' });

// We export the configured sequelize instance and models
module.exports = {
  sequelize,
  Company,
  User,
  Car,
  Client,
  Agency,
  Contrat,
  Brand,
  CarModel,
  AppState,
  Facture
};
