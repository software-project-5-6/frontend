// Role constants
export const ROLES = {
  ADMIN: "APP_ADMIN",
  USER: "APP_USER",
};

// Check if user has specific role
export const hasRole = (userRole, requiredRole) => {
  return userRole === requiredRole;
};

// Check if user has any of the specified roles
export const hasAnyRole = (userRole, roles) => {
  return roles.includes(userRole);
};

// Check if user is admin
export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};

// Check if user is regular user
export const isUser = (userRole) => {
  return userRole === ROLES.USER;
};
