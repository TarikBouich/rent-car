export const SAAS_PLANS = {
  demo: {
    id: 'demo',
    name: 'Démo',
    price: 0,
    priceStr: 'Gratuit',
    limits: {
      cars: 5,
      users: 1,
      agencies: 1,
      domains: 0,
      storage: 0
    },
    features: [
      '5 véhicules',
      '1 utilisateur',
      '1 agence',
      'Pas de site',
      '0 Go stockage'
    ]
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 149,
    priceStr: '149 MAD/mois',
    limits: {
      cars: 7,
      users: 4,
      agencies: 1,
      domains: 1,
      storage: 2
    },
    features: [
      '7 véhicules',
      '4 utilisateurs',
      '1 agence',
      '1 site rés.',
      '2 Go stockage'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 249,
    priceStr: '249 MAD/mois',
    limits: {
      cars: 20,
      users: 12,
      agencies: 2,
      domains: 2,
      storage: 10
    },
    features: [
      '20 véhicules',
      '12 utilisateurs',
      '2 agences',
      '2 sites rés.',
      '10 Go stockage'
    ]
  },
  entreprise: {
    id: 'entreprise',
    name: 'Entreprise',
    price: 399,
    priceStr: '399 MAD/mois',
    limits: {
      cars: 100,
      users: 20,
      agencies: 7,
      domains: 7,
      storage: 50
    },
    features: [
      '100 véhicules',
      '20 utilisateurs',
      '7 agences',
      '7 sites rés.',
      '50 Go stockage'
    ]
  }
};
