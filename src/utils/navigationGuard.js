import { useUserStore } from '../stores/userStore';

export function checkAccess(to) {
  const userStore = useUserStore();
  const currentUser =
    userStore.currentUser || JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  console.log('Checking access:', {
    path: to.path,
    requiresAuth: to.meta.requiresAuth,
    requiresAdmin: to.meta.requiresAdmin,
    currentUser,
    isAuthenticated: userStore.isAuthenticated,
    isAdmin: userStore.isAdmin
  });

  // If route doesn't require auth, allow access
  if (!to.meta.requiresAuth) {
    // If user is logged in and tries to access login page, redirect to appropriate page
    if (to.name === 'login' && currentUser) {
      console.log('User already logged in, redirecting from login');
      if (currentUser.role === 'superadmin') {
        return '/super-admin';
      } else {
        return currentUser.role === 'admin' ? '/dashboard' : '/cars';
      }
    }
    return null;
  }

  // If route requires auth but user is not logged in, redirect to login
  if (!currentUser) {
    console.log('No user found, redirecting to login');
    return '/login';
  }

  // Superadmin strict fencing
  if (currentUser.role === 'superadmin' && !to.path.startsWith('/super-admin')) {
    return '/super-admin';
  }
  if (currentUser.role !== 'superadmin' && to.path.startsWith('/super-admin')) {
    return '/dashboard';
  }

  // Map protected routes to their module permission strings
  const routeMappings = {
       'dashboard': 'Tableau de bord',
       'agents': 'Employés',
       'agents-add': 'Employés',
       'agent-profile': 'Employés',
       'agencies': 'Agences',
       'agency-profile': 'Agences',
       'agency-landing': 'Agences',
       'settings': 'Paramètres',
       'supervision': 'Paramètres',
       'contrats': 'Contrats',
       'contrats-add': 'Contrats',
       'contrat-print': 'Contrats'
  };

  const requiredPerm = routeMappings[to.name];

  const normalizeRole = (role) =>
    String(role || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const role = normalizeRole(currentUser?.role)
  const isAgencyRestrictedRole = role === 'gerant' || role === 'employe' || role === 'agent'

  // Non-admin agency users should never stay on /agencies listing; redirect to their own agency page.
  if (to.name === 'agencies' && !userStore.isAdmin && isAgencyRestrictedRole) {
    if (currentUser?.agencyId) {
      return `/agencies/${currentUser.agencyId}`
    }
    return '/cars'
  }

  // Prevent non-admin agency users from opening another agency profile by URL.
  if (to.name === 'agency-profile' && !userStore.isAdmin && isAgencyRestrictedRole) {
    if (!currentUser?.agencyId) return '/cars'
    if (to.params?.id !== currentUser.agencyId) {
      return `/agencies/${currentUser.agencyId}`
    }
  }

  // If route requires admin but user is not admin and lacks the explicit custom permission, redirect
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    if (!requiredPerm || currentUser.permissions?.[requiredPerm] !== true) {
      console.log('Non-admin user lacking explicit permission attempting to access restricted route:', to.path);
      return '/cars';
    }
  }

  // Fallback explicit check for dashboard which might be hardcoded below
  if (to.name === 'dashboard' && !userStore.isAdmin && currentUser.permissions?.['Tableau de bord'] !== true) {
    console.log('Non-admin user lacking permission attempting to access dashboard');
    return '/cars';
  }

  console.log('Access granted to:', to.path);
  return null;
}
