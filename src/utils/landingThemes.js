// Shared landing-page color themes (used by the preview modal and the page).
export const LANDING_THEMES = [
  { id: 'ocean',   name: 'Océan',    primary: '#0EA5E9', dark: '#0369A1', from: '#0C4A6E', to: '#38BDF8' },
  { id: 'emerald', name: 'Émeraude', primary: '#10B981', dark: '#047857', from: '#064E3B', to: '#34D399' },
  { id: 'rentcar', name: 'RentCar',  primary: '#FA5B0F', dark: '#C2410C', from: '#7C2D12', to: '#FB923C' }
]

export const getLandingTheme = (id) => LANDING_THEMES.find((t) => t.id === id) || LANDING_THEMES[0]
