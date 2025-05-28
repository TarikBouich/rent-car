export function initializeDefaultData() {
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
        password: 'password',
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

  // Initialize default cars if they don't exist
  if (!localStorage.getItem('cars')) {
    const cars = [
      // Premium Cars Agency (agency1) cars
      {
        id: 'car1',
        name: 'BMW X5',
        licensePlate: 'ABC123',
        brand: 'BMW',
        model: 'X5',
        year: 2022,
        color: 'Black',
        price: 100,
        agencyId: 'agency1',
        status: 'available',
        image: 'https://example.com/bmw-x5.jpg',
        currentMileage: 15000,
        nextVidangeKm: 20000,
        visiteTechniqueEndDate: '2024-12-31',
        assuranceEndDate: '2024-12-31'
      },
      {
        id: 'car2',
        name: 'Mercedes C-Class',
        licensePlate: 'DEF456',
        brand: 'Mercedes',
        model: 'C-Class',
        year: 2023,
        color: 'Silver',
        price: 90,
        agencyId: 'agency1',
        status: 'available',
        image: 'https://example.com/mercedes-c.jpg',
        currentMileage: 8000,
        nextVidangeKm: 15000,
        visiteTechniqueEndDate: '2024-11-30',
        assuranceEndDate: '2024-11-30'
      },
      // Luxury Rentals (agency2) cars
      {
        id: 'car3',
        name: 'Audi A6',
        licensePlate: 'GHI789',
        brand: 'Audi',
        model: 'A6',
        year: 2023,
        color: 'White',
        price: 95,
        agencyId: 'agency2',
        status: 'available',
        image: 'https://example.com/audi-a6.jpg',
        currentMileage: 12000,
        nextVidangeKm: 17000,
        visiteTechniqueEndDate: '2024-10-31',
        assuranceEndDate: '2024-10-31'
      },
      {
        id: 'car4',
        name: 'Range Rover Sport',
        licensePlate: 'JKL012',
        brand: 'Land Rover',
        model: 'Range Rover Sport',
        year: 2022,
        color: 'Gray',
        price: 120,
        agencyId: 'agency2',
        status: 'available',
        image: 'https://example.com/range-rover.jpg',
        currentMileage: 18000,
        nextVidangeKm: 23000,
        visiteTechniqueEndDate: '2024-09-30',
        assuranceEndDate: '2024-09-30'
      }
    ]
    localStorage.setItem('cars', JSON.stringify(cars))
  }

  // Initialize empty reservations array if it doesn't exist
  if (!localStorage.getItem('reservations')) {
    localStorage.setItem('reservations', JSON.stringify([]))
  }

  // Initialize empty clients array if it doesn't exist
  if (!localStorage.getItem('clients')) {
    localStorage.setItem('clients', JSON.stringify([]))
  }

  // Initialize empty completed reservations array if it doesn't exist
  if (!localStorage.getItem('completedReservations')) {
    localStorage.setItem('completedReservations', JSON.stringify([]))
  }
} 