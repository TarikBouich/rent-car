const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facture = sequelize.define('Facture', {
  id: { 
    type: DataTypes.STRING, 
    primaryKey: true 
  },
  companyId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  numero: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  contratId: { 
    type: DataTypes.STRING 
  },
  clientId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  carId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  agencyId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  issueDate: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  issueLocation: { 
    type: DataTypes.STRING 
  },
  lines: { 
    type: DataTypes.JSON 
  },
  tvaRate: { 
    type: DataTypes.FLOAT,
    defaultValue: 20
  },
  totals: { 
    type: DataTypes.JSON 
  },
  totalInWords: { 
    type: DataTypes.TEXT 
  },
  clientSnapshot: { 
    type: DataTypes.JSON 
  },
  carSnapshot: { 
    type: DataTypes.JSON 
  },
  agencySnapshot: { 
    type: DataTypes.JSON 
  }
});

module.exports = Facture;
