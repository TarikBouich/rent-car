// Default catalog: brands + models + categories.
// Images: paste a net image URL (or local /cars/xxx.jpg) once per model —
// every new car then reuses it automatically. Run: node scripts/seedCatalog.js
// Idempotent: safe to re-run, existing rows are kept.
const { sequelize, Brand, CarModel } = require('../models');

const CATALOG = [
  {
    id: 'brand_renault',
    name: 'Renault',
    models: [
      { id: 'model_renault_clio', name: 'Clio', category: 'Citadine', image: null },
      { id: 'model_renault_duster', name: 'Duster', category: 'SUV', image: null },
      { id: 'model_renault_logan', name: 'Logan', category: 'Berline', image: null },
    ],
  },
  {
    id: 'brand_peugeot',
    name: 'Peugeot',
    models: [
      { id: 'model_peugeot_208', name: '208', category: 'Citadine', image: null },
      { id: 'model_peugeot_2008', name: '2008', category: 'SUV', image: null },
      { id: 'model_peugeot_301', name: '301', category: 'Berline', image: null },
    ],
  },
];

async function seedCatalog() {
  try {
    await sequelize.sync({ alter: true });

    for (const b of CATALOG) {
      const [brand] = await Brand.findOrCreate({
        where: { id: b.id },
        defaults: { id: b.id, name: b.name },
      });
      console.log(`Brand OK: ${brand.name}`);

      for (const m of b.models) {
        const [model, created] = await CarModel.findOrCreate({
          where: { id: m.id },
          defaults: { ...m, brandId: b.id },
        });
        // Fill image on existing rows only if empty and seed provides one
        if (!created && m.image && !model.image) {
          await model.update({ image: m.image });
        }
        console.log(`  ${created ? 'Created' : 'Exists'}: ${m.name} (${m.category})`);
      }
    }

    console.log('Catalog seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Catalog seeding failed:', error);
    process.exit(1);
  }
}

seedCatalog();
