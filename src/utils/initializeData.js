export const initializeDefaultData = () => {
  // Initialize default cars if they don't exist
  const savedCars = localStorage.getItem('cars');
  if (!savedCars || JSON.parse(savedCars).length === 0) {
    const defaultCars = [
      {
        id: '1',
        name: 'Toyota Corolla',
        licensePlate: 'ABC-1234',
        pricePerDay: 500,
        status: 'Available',
        currentMileage: 50000,
        needsVidange: false,
        lastVidangeKm: 45000,
        nextVidangeKm: 50000,
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      },
      {
        id: '2',
        name: 'Honda Accord',
        licensePlate: 'DEF-5678',
        pricePerDay: 600,
        status: 'Available',
        currentMileage: 35000,
        needsVidange: false,
        lastVidangeKm: 30000,
        nextVidangeKm: 35000,
        image: "https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      },
      {
        id: '3',
        name: 'Mercedes C-Class',
        licensePlate: 'GHI-9012',
        pricePerDay: 1200,
        status: 'Available',
        currentMileage: 25000,
        needsVidange: false,
        lastVidangeKm: 20000,
        nextVidangeKm: 25000,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      },
      {
        id: '4',
        name: 'BMW 3 Series',
        licensePlate: 'JKL-3456',
        pricePerDay: 1100,
        status: 'Available',
        currentMileage: 30000,
        needsVidange: false,
        lastVidangeKm: 25000,
        nextVidangeKm: 30000,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      }
    ];
    localStorage.setItem('cars', JSON.stringify(defaultCars));
  }

  // Initialize default clients if they don't exist
  const savedClients = localStorage.getItem('clients');
  if (!savedClients || JSON.parse(savedClients).length === 0) {
    const defaultClients = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        nationalId: 'AB123456',
        phoneNumber: '0612345678',
        email: 'john.doe@email.com',
        address: '123 Main St, Casablanca',
        licenseNumber: 'DL123456',
        licenseDate: '2020-01-01',
        licenseCity: 'Casablanca',
        nationality: 'Moroccan',
        birthDate: '1990-01-01',
        profession: 'Engineer'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        nationalId: 'CD789012',
        phoneNumber: '0623456789',
        email: 'jane.smith@email.com',
        address: '456 Park Ave, Rabat',
        licenseNumber: 'DL789012',
        licenseDate: '2019-06-15',
        licenseCity: 'Rabat',
        nationality: 'Moroccan',
        birthDate: '1988-05-15',
        profession: 'Doctor'
      },
      {
        id: '3',
        firstName: 'Mohammed',
        lastName: 'Alami',
        nationalId: 'EF345678',
        phoneNumber: '0634567890',
        email: 'mohammed.alami@email.com',
        address: '789 Beach Rd, Agadir',
        licenseNumber: 'DL345678',
        licenseDate: '2021-03-20',
        licenseCity: 'Agadir',
        nationality: 'Moroccan',
        birthDate: '1992-08-10',
        profession: 'Teacher'
      }
    ];
    localStorage.setItem('clients', JSON.stringify(defaultClients));
  }
}; 