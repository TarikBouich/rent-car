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
        brandId: 'brand3',
        modelId: 'model3',
        year: 2022,
        color: '#000000',
        pricePerDay: 100,
        agencyId: 'agency1',
        status: 'Available',
        image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/BMW/X5-2023/10452/1688992642182/front-left-side-47.jpg?impolicy=resize&amp;imwidth=420',
        currentMileage: 15000,
        nextVidangeKm: 20000,
        visiteTechniqueEndDate: '2026-12-31',
        assuranceEndDate: '2026-12-31'
      },
      {
        id: 'car2',
        name: 'Mercedes C-Class',
        licensePlate: 'DEF456',
        brandId: 'brand2',
        modelId: 'model2',
        year: 2023,
        color: '#c0c0c0',
        pricePerDay: 90,
        agencyId: 'agency1',
        status: 'Available',
        image: 'https://vehicle-images.dealerinspire.com/01a0-11001591/thumbnails/large/W1KAF4GB4SR269463/e550ca2ad063585bc6ee241f58b25c12.jpghttps://vehicle-images.dealerinspire.com/01a0-11001591/thumbnails/large/W1KAF4GB4SR269463/e550ca2ad063585bc6ee241f58b25c12.jpg',
        currentMileage: 8000,
        nextVidangeKm: 15000,
        visiteTechniqueEndDate: '2025-11-30',
        assuranceEndDate: '2025-11-30'
      },
      // Luxury Rentals (agency2) cars
      {
        id: 'car3',
        name: 'Toyota Corolla',
        licensePlate: 'GHI789',
        brandId: 'brand1',
        modelId: 'model1',
        year: 2023,
        color: '#ffffff',
        pricePerDay: 95,
        agencyId: 'agency2',
        status: 'Available',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcjThJTGLSG4VwfZEyOEVeHuW9piWHZ8Fdag&s',
        currentMileage: 12000,
        nextVidangeKm: 17000,
        visiteTechniqueEndDate: '2026-10-31',
        assuranceEndDate: '2026-10-31'
      },
      {
        id: 'car4',
        name: 'Clio 4',
        licensePlate: 'JKL012',
        brandId: 'brand4',
        modelId: 'model4',
        year: 2022,
        color: '#808080',
        pricePerDay: 120,
        agencyId: 'agency2',
        status: 'Available',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7dJxhHh9ybeAR7whqxPXyhGpws_yxCTirznldy3q77KBAt6qY-Gff4OQUqFYhGf3YgLc&usqp=CAU',
        currentMileage: 18000,
        nextVidangeKm: 23000,
        visiteTechniqueEndDate: '2025-09-30',
        assuranceEndDate: '2025-09-30'
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