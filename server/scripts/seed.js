const { sequelize, Company, User, Car } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Warning: this drops all tables and recreates them!
    
    console.log('Database synced. Seeding...');

    // 1. Create Default SaaS Company and Super Admin Zone
    await Company.create({
      id: 'COMP-SUPERADMIN',
      name: 'SuperAdmin System',
      email: 'system@rentcar.com',
      planId: 'entreprise'
    });

    await User.create({
      id: 'usr_sa',
      name: 'Super Admin',
      email: 'superadmin@test.com',
      password: 'admin', // In real life, bcrypt this
      role: 'superadmin',
      companyId: 'COMP-SUPERADMIN'
    });

    // 2. Create First Real Tenant
    const comp1 = await Company.create({
      id: 'COMP-001',
      name: 'Agence Alpha',
      email: 'contact@alpha.com',
      planId: 'entreprise' // From our migrations
    });

    await User.create({
      id: 'usr_admin1',
      name: 'Admin Alpha',
      email: 'admin@test.com',
      password: 'admin',
      role: 'admin',
      companyId: comp1.id
    });

    // Seed some cars for COMP-001
    await Car.create({
      id: 'car_1',
      companyId: comp1.id,
      marque: 'Peugeot',
      modele: '208',
      immatriculation: '12345-A-6',
      year: '2022',
      status: 'disponible',
      mileage: 15400,
      fuelType: 'Diesel',
      pricePerDay: 250
    });
    
    await Car.create({
      id: 'car_2',
      companyId: comp1.id,
      marque: 'Renault',
      modele: 'Clio 5',
      immatriculation: '54321-B-7',
      year: '2023',
      status: 'louee',
      mileage: 8200,
      fuelType: 'Essence',
      pricePerDay: 300
    });

    console.log('Seeding Complete! You can now login with superadmin@test.com or admin@test.com');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
