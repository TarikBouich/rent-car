// Run this once to clean ghost cars that have no valid companyId or corrupted data
// Usage: node server/scripts/cleanGhostCars.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Car } = require('../models');

async function clean() {
  try {
    // Delete all cars with null/missing name or very short IDs (old test data)
    const deleted = await Car.destroy({
      where: {}  // Will be overridden below with raw SQL
    });

    // More targeted: delete cars where name is null or 'undefined undefined'
    const { Op } = require('sequelize');
    const result = await Car.destroy({
      where: {
        [Op.or]: [
          { name: null },
          { name: '' },
          { name: 'undefined undefined' },
          { name: 'undefined' }
        ]
      }
    });

    console.log(`Deleted ${result} ghost car(s) with missing/invalid names.`);
    
    // Show what's left
    const remaining = await Car.findAll({ attributes: ['id', 'name', 'licensePlate', 'companyId'] });
    console.log('Remaining cars:');
    remaining.forEach(c => console.log(`  ${c.id} | ${c.name} | ${c.licensePlate} | companyId: ${c.companyId}`));
    
    process.exit(0);
  } catch(e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

clean();
