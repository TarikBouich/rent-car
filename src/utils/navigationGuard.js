import { useUserStore } from '../stores/userStore';

export function checkAccess(to, router) {
  const userStore = useUserStore();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
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
         router.push('/super-admin');
      } else {
         router.push(currentUser.role === 'admin' ? '/dashboard' : '/cars');
      }
      return false;
    }
    return true;
  }

  // If route requires auth but user is not logged in, redirect to login
  if (!currentUser) {
    console.log('No user found, redirecting to login');
    router.push('/login');
    return false;
  }

  // Superadmin strict fencing
  if (currentUser.role === 'superadmin' && !to.path.startsWith('/super-admin')) {
    router.push('/super-admin');
    return false;
  }
  if (currentUser.role !== 'superadmin' && to.path.startsWith('/super-admin')) {
    router.push('/dashboard');
    return false;
  }

  // Map protected routes to their module permission strings
  const routeMappings = {
       'dashboard': 'Tableau de bord',
       'agents': 'Employés',
       'agents-add': 'Employés',
       'agent-profile': 'Employés',
       'agencies': 'Agences',
       'agency-profile': 'Agences',
       'settings': 'Paramètres',
       'supervision': 'Paramètres',
       'contrats': 'Contrats',
       'contrats-add': 'Contrats',
       'contrat-print': 'Contrats'
  };

  const requiredPerm = routeMappings[to.name];

  // If route requires admin but user is not admin and lacks the explicit custom permission, redirect
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    if (!requiredPerm || currentUser.permissions?.[requiredPerm] !== true) {
      console.log('Non-admin user lacking explicit permission attempting to access restricted route:', to.path);
      router.push('/cars');
      return false;
    }
  }

  // Fallback explicit check for dashboard which might be hardcoded below
  if (to.name === 'dashboard' && !userStore.isAdmin && currentUser.permissions?.['Tableau de bord'] !== true) {
    console.log('Non-admin user lacking permission attempting to access dashboard');
    router.push('/cars');
    return false;
  }

  console.log('Access granted to:', to.path);
  return true;
} 