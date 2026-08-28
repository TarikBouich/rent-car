const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contrat = sequelize.define('Contrat', {
  id: { type: DataTypes.STRING, primaryKey: true },
  numero: { type: DataTypes.STRING },
  clientId: { type: DataTypes.STRING, allowNull: false },
  carId: { type: DataTypes.STRING, allowNull: false },
  agencyId: { type: DataTypes.STRING, allowNull: false },
  
  dateContrat: { type: DataTypes.DATE },
  lieuContrat: { type: DataTypes.STRING },
  
  dateSortie: { type: DataTypes.DATE },
  dateRetour: { type: DataTypes.DATE },
  duree: { type: DataTypes.INTEGER },
  
  lieuLivraison: { type: DataTypes.STRING },
  lieuRecuperation: { type: DataTypes.STRING },
  
  kmDepart: { type: DataTypes.INTEGER },
  carburantDepart: { type: DataTypes.STRING },
  
  prixParJour: { type: DataTypes.FLOAT },
  total: { type: DataTypes.FLOAT },
  avance: { type: DataTypes.FLOAT, defaultValue: 0 },
  reste: { type: DataTypes.FLOAT },
  typePaiement: { type: DataTypes.STRING },
  
  etat: { type: DataTypes.STRING, defaultValue: 'En cours' },
  
  departDamages: { type: DataTypes.JSON },
  retourDamages: { type: DataTypes.JSON },
  
  hasConducteur2: { type: DataTypes.BOOLEAN, defaultValue: false },
  conducteur2: { type: DataTypes.JSON }, // { nom: '', cin: '', permis: '', tel: '' }
  
  clientSignature: { type: DataTypes.TEXT('long') },
  
  // Legacy backups just in case
  paidAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = Contrat;
