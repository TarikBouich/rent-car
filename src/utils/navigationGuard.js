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
      router.push(currentUser.role === 'admin' ? '/dashboard' : '/cars');
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

  // If route requires admin but user is not admin, redirect to cars page
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    console.log('Non-admin user attempting to access admin route, redirecting to /cars');
    router.push('/cars');
    return false;
  }

  // If user is not admin and tries to access dashboard, redirect to cars
  if (to.name === 'dashboard' && !userStore.isAdmin) {
    console.log('Non-admin user attempting to access dashboard, redirecting to /cars');
    router.push('/cars');
    return false;
  }

  console.log('Access granted to:', to.path);
  return true;
} 