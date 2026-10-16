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
      { id: 'model_renault_clio5', name: 'Clio 5', category: 'Citadine', image: null },
      { id: 'model_renault_captur', name: 'Captur', category: 'SUV', image: null },
      { id: 'model_renault_kadjar', name: 'Kadjar', category: 'SUV', image: null },
      { id: 'model_renault_megane', name: 'Mégane', category: 'Berline', image: null },
      { id: 'model_renault_talisman', name: 'Talisman', category: 'Berline', image: null },
      { id: 'model_renault_express', name: 'Express', category: 'Utilitaire', image: null },
      { id: 'model_renault_kangoo', name: 'Kangoo', category: 'Utilitaire', image: null },
    ],
  },
  {
    id: 'brand_dacia',
    name: 'Dacia',
    models: [
      { id: 'model_dacia_logan', name: 'Logan', category: 'Berline', image: null },
      { id: 'model_dacia_sandero', name: 'Sandero', category: 'Citadine', image: null },
      { id: 'model_dacia_duster', name: 'Duster', category: 'SUV', image: null },
      { id: 'model_dacia_lodgy', name: 'Lodgy', category: 'Monospace', image: null },
      { id: 'model_dacia_dokker', name: 'Dokker', category: 'Utilitaire', image: null },
      { id: 'model_dacia_jogger', name: 'Jogger', category: 'Monospace', image: null },
    ],
  },
  {
    id: 'brand_peugeot',
    name: 'Peugeot',
    models: [
      { id: 'model_peugeot_208', name: '208', category: 'Citadine', image: null },
      { id: 'model_peugeot_2008', name: '2008', category: 'SUV', image: null },
      { id: 'model_peugeot_301', name: '301', category: 'Berline', image: null },
      { id: 'model_peugeot_308', name: '308', category: 'Berline', image: null },
      { id: 'model_peugeot_3008', name: '3008', category: 'SUV', image: null },
      { id: 'model_peugeot_5008', name: '5008', category: 'SUV', image: null },
      { id: 'model_peugeot_rifter', name: 'Rifter', category: 'Utilitaire', image: null },
      { id: 'model_peugeot_partner', name: 'Partner', category: 'Utilitaire', image: null },
    ],
  },
  {
    id: 'brand_citroen',
    name: 'Citroën',
    models: [
      { id: 'model_citroen_c3', name: 'C3', category: 'Citadine', image: null },
      { id: 'model_citroen_c4', name: 'C4', category: 'Berline', image: null },
      { id: 'model_citroen_c5', name: 'C5', category: 'Berline', image: null },
      { id: 'model_citroen_celysee', name: 'C-Elysée', category: 'Berline', image: null },
      { id: 'model_citroen_berlingo', name: 'Berlingo', category: 'Utilitaire', image: null },
    ],
  },
  {
    id: 'brand_volkswagen',
    name: 'Volkswagen',
    models: [
      { id: 'model_vw_polo', name: 'Polo', category: 'Citadine', image: null },
      { id: 'model_vw_golf', name: 'Golf', category: 'Berline', image: null },
      { id: 'model_vw_tiguan', name: 'Tiguan', category: 'SUV', image: null },
      { id: 'model_vw_passat', name: 'Passat', category: 'Berline', image: null },
      { id: 'model_vw_touareg', name: 'Touareg', category: 'SUV', image: null },
      { id: 'model_vw_caddy', name: 'Caddy', category: 'Utilitaire', image: null },
    ],
  },
  {
    id: 'brand_toyota',
    name: 'Toyota',
    models: [
      { id: 'model_toyota_yaris', name: 'Yaris', category: 'Citadine', image: null },
      { id: 'model_toyota_corolla', name: 'Corolla', category: 'Berline', image: null },
      { id: 'model_toyota_chr', name: 'C-HR', category: 'SUV', image: null },
      { id: 'model_toyota_rav4', name: 'RAV4', category: 'SUV', image: null },
      { id: 'model_toyota_hilux', name: 'Hilux', category: 'Pick-up', image: null },
      { id: 'model_toyota_landcruiser', name: 'Land Cruiser', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_hyundai',
    name: 'Hyundai',
    models: [
      { id: 'model_hyundai_i10', name: 'i10', category: 'Citadine', image: null },
      { id: 'model_hyundai_i20', name: 'i20', category: 'Citadine', image: null },
      { id: 'model_hyundai_accent', name: 'Accent', category: 'Berline', image: null },
      { id: 'model_hyundai_elantra', name: 'Elantra', category: 'Berline', image: null },
      { id: 'model_hyundai_tucson', name: 'Tucson', category: 'SUV', image: null },
      { id: 'model_hyundai_santafe', name: 'Santa Fe', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_kia',
    name: 'Kia',
    models: [
      { id: 'model_kia_picanto', name: 'Picanto', category: 'Citadine', image: null },
      { id: 'model_kia_rio', name: 'Rio', category: 'Citadine', image: null },
      { id: 'model_kia_cerato', name: 'Cerato', category: 'Berline', image: null },
      { id: 'model_kia_sportage', name: 'Sportage', category: 'SUV', image: null },
      { id: 'model_kia_sorento', name: 'Sorento', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_fiat',
    name: 'Fiat',
    models: [
      { id: 'model_fiat_500', name: '500', category: 'Citadine', image: null },
      { id: 'model_fiat_panda', name: 'Panda', category: 'Citadine', image: null },
      { id: 'model_fiat_tipo', name: 'Tipo', category: 'Berline', image: null },
      { id: 'model_fiat_500x', name: '500X', category: 'SUV', image: null },
      { id: 'model_fiat_doblo', name: 'Doblò', category: 'Utilitaire', image: null },
    ],
  },
  {
    id: 'brand_skoda',
    name: 'Skoda',
    models: [
      { id: 'model_skoda_fabia', name: 'Fabia', category: 'Citadine', image: null },
      { id: 'model_skoda_octavia', name: 'Octavia', category: 'Berline', image: null },
      { id: 'model_skoda_superb', name: 'Superb', category: 'Berline', image: null },
      { id: 'model_skoda_kamiq', name: 'Kamiq', category: 'SUV', image: null },
      { id: 'model_skoda_kodiaq', name: 'Kodiaq', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_seat',
    name: 'Seat',
    models: [
      { id: 'model_seat_ibiza', name: 'Ibiza', category: 'Citadine', image: null },
      { id: 'model_seat_leon', name: 'León', category: 'Berline', image: null },
      { id: 'model_seat_arona', name: 'Arona', category: 'SUV', image: null },
      { id: 'model_seat_ateca', name: 'Ateca', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_opel',
    name: 'Opel',
    models: [
      { id: 'model_opel_corsa', name: 'Corsa', category: 'Citadine', image: null },
      { id: 'model_opel_astra', name: 'Astra', category: 'Berline', image: null },
      { id: 'model_opel_mokka', name: 'Mokka', category: 'SUV', image: null },
      { id: 'model_opel_grandland', name: 'Grandland', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_ford',
    name: 'Ford',
    models: [
      { id: 'model_ford_fiesta', name: 'Fiesta', category: 'Citadine', image: null },
      { id: 'model_ford_focus', name: 'Focus', category: 'Berline', image: null },
      { id: 'model_ford_kuga', name: 'Kuga', category: 'SUV', image: null },
      { id: 'model_ford_ranger', name: 'Ranger', category: 'Pick-up', image: null },
      { id: 'model_ford_transit', name: 'Transit', category: 'Utilitaire', image: null },
    ],
  },
  {
    id: 'brand_nissan',
    name: 'Nissan',
    models: [
      { id: 'model_nissan_micra', name: 'Micra', category: 'Citadine', image: null },
      { id: 'model_nissan_juke', name: 'Juke', category: 'SUV', image: null },
      { id: 'model_nissan_qashqai', name: 'Qashqai', category: 'SUV', image: null },
      { id: 'model_nissan_xtrail', name: 'X-Trail', category: 'SUV', image: null },
      { id: 'model_nissan_patrol', name: 'Patrol', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_honda',
    name: 'Honda',
    models: [
      { id: 'model_honda_jazz', name: 'Jazz', category: 'Citadine', image: null },
      { id: 'model_honda_civic', name: 'Civic', category: 'Berline', image: null },
      { id: 'model_honda_accord', name: 'Accord', category: 'Berline', image: null },
      { id: 'model_honda_crv', name: 'CR-V', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_mercedes',
    name: 'Mercedes-Benz',
    models: [
      { id: 'model_mb_a', name: 'Classe A', category: 'Berline', image: null },
      { id: 'model_mb_c', name: 'Classe C', category: 'Berline', image: null },
      { id: 'model_mb_e', name: 'Classe E', category: 'Berline', image: null },
      { id: 'model_mb_gla', name: 'GLA', category: 'SUV', image: null },
      { id: 'model_mb_glc', name: 'GLC', category: 'SUV', image: null },
      { id: 'model_mb_vito', name: 'Vito', category: 'Utilitaire', image: null },
      { id: 'model_mb_sprinter', name: 'Sprinter', category: 'Utilitaire', image: null },
    ],
  },
  {
    id: 'brand_bmw',
    name: 'BMW',
    models: [
      { id: 'model_bmw_1', name: 'Série 1', category: 'Berline', image: null },
      { id: 'model_bmw_3', name: 'Série 3', category: 'Berline', image: null },
      { id: 'model_bmw_5', name: 'Série 5', category: 'Berline', image: null },
      { id: 'model_bmw_x1', name: 'X1', category: 'SUV', image: null },
      { id: 'model_bmw_x3', name: 'X3', category: 'SUV', image: null },
      { id: 'model_bmw_x5', name: 'X5', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_audi',
    name: 'Audi',
    models: [
      { id: 'model_audi_a1', name: 'A1', category: 'Citadine', image: null },
      { id: 'model_audi_a3', name: 'A3', category: 'Berline', image: null },
      { id: 'model_audi_a4', name: 'A4', category: 'Berline', image: null },
      { id: 'model_audi_q3', name: 'Q3', category: 'SUV', image: null },
      { id: 'model_audi_q5', name: 'Q5', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_suzuki',
    name: 'Suzuki',
    models: [
      { id: 'model_suzuki_swift', name: 'Swift', category: 'Citadine', image: null },
      { id: 'model_suzuki_vitara', name: 'Vitara', category: 'SUV', image: null },
      { id: 'model_suzuki_jimny', name: 'Jimny', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_jeep',
    name: 'Jeep',
    models: [
      { id: 'model_jeep_renegade', name: 'Renegade', category: 'SUV', image: null },
      { id: 'model_jeep_compass', name: 'Compass', category: 'SUV', image: null },
      { id: 'model_jeep_wrangler', name: 'Wrangler', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_landrover',
    name: 'Land Rover',
    models: [
      { id: 'model_lr_defender', name: 'Defender', category: 'SUV', image: null },
      { id: 'model_lr_discovery', name: 'Discovery', category: 'SUV', image: null },
      { id: 'model_lr_evoque', name: 'Range Rover Evoque', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_mitsubishi',
    name: 'Mitsubishi',
    models: [
      { id: 'model_mit_asx', name: 'ASX', category: 'SUV', image: null },
      { id: 'model_mit_outlander', name: 'Outlander', category: 'SUV', image: null },
      { id: 'model_mit_l200', name: 'L200', category: 'Pick-up', image: null },
    ],
  },
  {
    id: 'brand_mazda',
    name: 'Mazda',
    models: [
      { id: 'model_mazda_2', name: 'Mazda2', category: 'Citadine', image: null },
      { id: 'model_mazda_3', name: 'Mazda3', category: 'Berline', image: null },
      { id: 'model_mazda_cx5', name: 'CX-5', category: 'SUV', image: null },
    ],
  },
  {
    id: 'brand_tesla',
    name: 'Tesla',
    models: [
      { id: 'model_tesla_3', name: 'Model 3', category: 'Berline', image: null },
      { id: 'model_tesla_y', name: 'Model Y', category: 'SUV', image: null },
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
        try {
          const [model, created] = await CarModel.findOrCreate({
            where: { id: m.id },
            defaults: { ...m, brandId: b.id },
          });
          // Fill image on existing rows only if empty and seed provides one
          if (!created && m.image && !model.image) {
            await model.update({ image: m.image });
          }
          console.log(`  ${created ? 'Created' : 'Exists'}: ${m.name} (${m.category})`);
        } catch (e) {
          console.error(`  FAILED: ${m.id} ${m.name} -> ${e.message}`);
        }
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
