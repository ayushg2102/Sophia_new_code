/**
 * Utility function to handle user logout
 * Redirects to external SSO login URL
 */
export const handleLogout = () => {
  // Clear any local storage or session storage if needed
  localStorage.clear();
  sessionStorage.clear();
  
  // Redirect to external SSO login URL
  window.location.href = 'https://sophia.xponance.com/api/auth/login';
};

/**
 * Alternative logout function that uses React Router navigation
 * Use this if you want to navigate to the /login route instead of direct redirect
 */
export const navigateToLogin = (navigate: (path: string) => void) => {
  // Clear any local storage or session storage if needed
  localStorage.clear();
  sessionStorage.clear();
  
  // Navigate to /login route which will trigger external redirect
  navigate('/login');
};
