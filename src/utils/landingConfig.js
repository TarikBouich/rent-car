import { LANDING_THEMES } from './landingThemes';

export const LANDING_TEMPLATES = [
  {
    id: 'prestige',
    name: 'Prestige',
    description: 'Héro en deux colonnes, chiffres clés, flotte en cartes et fiche agence sombre.'
  },
  {
    id: 'editorial',
    name: 'Éditorial',
    description: 'Mise en page magazine, grande typographie, sélection horizontale et sections épurées.'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Fond sombre, héro en bento grid, cartes néon et parcours de réservation en 3 étapes.'
  }
];

export const defaultLandingConfig = (agency = {}) => {
  const city = agency.ville || agency.location || 'votre ville';
  const name = agency.name || 'Notre agence';
  return {
    template: 'prestige',
    theme: 'ocean',
    content: {
      badge: 'Location de voitures & utilitaires',
      heroTitle: 'Louez la voiture parfaite',
      heroHighlight: city,
      heroSubtitle: `${name} met à votre disposition une flotte moderne et entretenue. Tarifs transparents, véhicules récents et service client disponible 7j/7.`,
      primaryCta: 'Découvrir la flotte',
      secondaryCta: 'Nous contacter',
      fleetTitle: 'Nos véhicules en location',
      fleetSubtitle: 'Une sélection de véhicules entretenus, prête à vous accompagner au quotidien.',
      aboutTitle: 'À propos',
      aboutHeading: name,
      aboutText: `Votre agence de location de voitures située à ${city}. Nous proposons des véhicules soigneusement entretenus, une prise en charge rapide et des tarifs compétitifs, adaptés à vos besoins professionnels ou personnels.`,
      contactTitle: 'Prêt à prendre la route ?',
      contactText: `Contactez ${name} dès maintenant pour réserver votre véhicule ou obtenir un devis personnalisé.`,
      phone: agency.phone || '',
      email: agency.email || '',
      address: [agency.address, city].filter(Boolean).join(', '),
      whatsapp: agency.phone || '',
      showStats: true,
      showFleet: true,
      showAbout: true,
      showContact: true,
      features: [
        { title: 'Véhicules contrôlés', text: 'Entretien et visites techniques à jour' },
        { title: 'Tarifs transparents', text: 'Aucun frais caché, devis clair' },
        { title: 'Service réactif', text: 'Une équipe à votre écoute 7j/7' },
        { title: 'Localisation idéale', text: city }
      ]
    }
  };
};

export const normalizeLandingConfig = (raw, agency = {}) => {
  const defaults = defaultLandingConfig(agency);
  const config = raw && typeof raw === 'object' ? raw : {};

  const template = LANDING_TEMPLATES.some(t => t.id === config.template)
    ? config.template
    : defaults.template;

  const theme = LANDING_THEMES.some(t => t.id === config.theme)
    ? config.theme
    : defaults.theme;

  const content = { ...defaults.content, ...(config.content || {}) };
  if (Array.isArray(config.content?.features) && config.content.features.length) {
    content.features = defaults.content.features.map((f, i) => ({
      ...f,
      ...(config.content.features[i] || {})
    }));
  }

  return {
    ...config,
    template,
    theme,
    content
  };
};

export const landingDraftKey = (agencyId) => `agency_landing_draft_${agencyId}`;
export const landingLiveKey = (agencyId) => `agency_landing_${agencyId}`;
