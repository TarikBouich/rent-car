export function initializeData() {
  // Initialize agencies if they don't exist
  if (!localStorage.getItem('agencies')) {
    const agencies = [
      {
        id: 'agency1',
        name: 'Premium Cars Agency',
        location: 'Downtown',
        contact: '+1234567890'
      },
      {
        id: 'agency2',
        name: 'Luxury Rentals',
        location: 'Uptown',
        contact: '+1234567891'
      }
    ]
    localStorage.setItem('agencies', JSON.stringify(agencies))
  }

  // Initialize users if they don't exist
  if (!localStorage.getItem('users')) {
    const users = [
      {
        id: 'user1',
        email: 'admin@location.com',
        password: 'password', // In a real app, this would be hashed
        name: 'Admin User',
        role: 'admin',
        agencyId: 'agency1'
      },
      {
        id: 'user2',
        email: 'agent1@premium.com',
        password: 'password123',
        name: 'John Agent',
        role: 'agent',
        agencyId: 'agency1'
      },
      {
        id: 'user3',
        email: 'agent2@luxury.com',
        password: 'password123',
        name: 'Jane Agent',
        role: 'agent',
        agencyId: 'agency2'
      }
    ]
    localStorage.setItem('users', JSON.stringify(users))
  }

  // Initialize clients if they don't exist
  if (!localStorage.getItem('clients')) {
    const clients = [
      {
        id: 'client1', // Using simple IDs for now, can generate later
        nationalId: 'AB123456',
        firstName: 'Tarik',
        lastName: 'Bouich',
        phoneNumber: '0600000000',
        nationality: 'Moroccan',
        licenseNumber: 'L12345',
        agencyId: 'agency1' // Link client to an agency
      },
      {
        id: 'client2',
        nationalId: 'CD789012',
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '0700000000',
        nationality: 'American',
        licenseNumber: 'L67890',
        agencyId: 'agency2' // Link client to another agency
      }
    ];
    localStorage.setItem('clients', JSON.stringify(clients));
  }

  // Initialize cars if they don't exist
  if (!localStorage.getItem('cars')) {
    const cars = [
      {
        id: 'car1', // Using simple IDs for now
        licensePlate: 'DEF456',
        name: 'Mercedes C-Class',
        brandId: 'brand2',
        modelId: 'model2',
        color: '#c0c0c0',
        pricePerDay: 300,
        status: 'Rented', // Set status to Rented for the initial reservation
        currentMileage: 9000,
        needsVidange: false,
        lastVidangeKm: 0,
        nextVidangeKm: 0,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
        agencyId: 'agency1', // Link car to an agency
        fuel: 'Diesel',
        transmission: 'Automatique',
        category: 'Luxe',
        options: [
          { id: 'opt1', name: 'Siège Bébé', price: 50, enabled: false, icon: 'Users' }
        ]
      },
      {
        id: 'car2',
        licensePlate: 'GHI789',
        name: 'BMW X5',
        brandId: 'brand3',
        modelId: 'model3',
        color: '#ffffff',
        pricePerDay: 350,
        status: 'Available',
        currentMileage: 15000,
        needsVidange: true,
        lastVidangeKm: 12000,
        nextVidangeKm: 17000,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
        agencyId: 'agency2', // Link car to another agency
        fuel: 'Essence',
        transmission: 'Manuelle',
        category: 'SUV',
        options: [
          { id: 'opt2', name: 'GPS', price: 30, enabled: true, icon: 'Map' },
          { id: 'opt3', name: 'Chauffeur', price: 200, enabled: false, icon: 'User' }
        ]
      }
    ];
    localStorage.setItem('cars', JSON.stringify(cars));
  }

  // Initialize reservations if they don't exist
  if (!localStorage.getItem('reservations')) {
    const reservations = [
      {
        id: 'res1', // Using simple IDs
        clientId: 'AB123456', // Link to existing client1
        carId: 'DEF456', // Link to existing car1
        carName: 'Mercedes C-Class', // Add car name for easier display
        currentMileage: 9000, // Add current mileage from car
        pricePerDay: 300, // Add price per day from car
        startDate: '2025-06-01',
        endDate: '2025-06-07',
        numberOfDays: 7,
        totalPrice: 2100,
        advance: 0,
        status: 'Active',
        agentId: 'user2', // Link to existing agent user2
        agencyId: 'agency1', // Link to existing agency1
        hasSecondDriver: false,
        secondDriver: {
          firstName: "",
          lastName: "",
          license: "",
          licenseDate: "",
          licenseCity: "",
          cin: "",
          cinDeliveredAt: "",
        },
      }
    ];
  }

  // Initialize charges if they don't exist
  if (!localStorage.getItem('charges')) {
    const charges = [];
    localStorage.setItem('charges', JSON.stringify(charges));
  }

  // --- SAAS MIGRATION VERIFICATION ---
  const MIGRATION_KEY = 'migrated_to_saas_v1'
  if (!localStorage.getItem(MIGRATION_KEY)) {
     const defaultCompanyId = 'COMP-001'
     
     // Ensure COMP-001 exists in companies
     let companies = JSON.parse(localStorage.getItem('companies') || '[]')
     if (!companies.find(c => c.id === defaultCompanyId)) {
        companies.push({ id: defaultCompanyId, name: 'Entreprise par Défaut', email: 'admin@location.com', status: 'Active', planId: 'entreprise', createdAt: new Date().toISOString() })
        localStorage.setItem('companies', JSON.stringify(companies))
     }

     // Migrate all stores to include companyId
     const storesToMigrate = ['agencies', 'users', 'clients', 'cars', 'reservations', 'charges', 'contrats', 'transactions']
     storesToMigrate.forEach(storeName => {
        let items = JSON.parse(localStorage.getItem(storeName) || '[]')
        let modified = false
        items = items.map(item => {
           if (!item.companyId) {
             modified = true
             return { ...item, companyId: defaultCompanyId }
           }
           return item
        })
        if (modified) {
           localStorage.setItem(storeName, JSON.stringify(items))
        }
     })

     // Create default SUPER ADMIN if not exists
     let users = JSON.parse(localStorage.getItem('users') || '[]')
     if (!users.find(u => u.email === 'superadmin@rentcar.com')) {
         users.push({
             id: 'superadmin1',
             email: 'superadmin@rentcar.com',
             password: 'superadmin123',
             name: 'SaaS Super Admin',
             role: 'superadmin',
             companyId: null, // SuperAdmin belongs to NO company
             agencyId: null,
             permissions: {}
         })
         localStorage.setItem('users', JSON.stringify(users))
     }

     localStorage.setItem(MIGRATION_KEY, 'true')
  }
}  