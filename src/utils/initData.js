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
} 