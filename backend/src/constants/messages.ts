export const ERROR = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_USER_DATA: 'Invalid user data',
  USER_NOT_FOUND: 'User not found',
  INVALID_EXPIRED_OTP: 'Invalid/Expired OTP',
  // User Error Messages
  USER_EXISTS_WITH_EMAIL_MOBILE: 'User already exists with the provided Email and Mobile number',
  USER_EXISTS_WITH_EMAIL: 'User already exists with the provided Email',
  USER_EXISTS_WITH_MOBILE: 'User already exists with the provided Mobile number',
  USERID_CANNOT_BE_BLANK: 'userId cannot be blank',

  // Product Error Messages
  PRODUCT_NOT_FOUND: 'Product not found',
  
  ENTER_VALID_NAME: 'Please provide a valid name',
  ENTER_VALID_EMAIL: 'Please provide a valid email address',
  ENTER_VALID_MOBILE: 'Please provide a valid 10-digit mobile number',
  BAD_REQUEST: 'Bad Request',
  ORIGIN_HEADER_IS_MISSING: 'Origin header is missing',
  ACCESS_FORBIDDEN: 'Access Forbidden',
  ACCESS_DENIED: 'Access Denied',
  NOT_AUTHENTICATED: 'Not authenticated',
  NO_TOKEN_PROVIDED: 'No token provided',
  NOT_AUTHORIZED: 'Not authorized',
  ROUTE_NOT_FOUND: 'Route not found or wrong API method',
};

export const SUCCESS = {
  USER_FOUND: 'User Found',
  REGISTRATION_SUCCESSFUL: 'Registration successful',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',

  // product success messages
  PRODUCT_FOUND: 'Product Found',
  PRODUCT_LIST_FOUND: 'Product List Found',
  PRODUCT_DELETED: 'Product Deleted',
  PRODUCT_UPDATED: 'Product Updated',
  PRODUCT_CREATED: 'Product Created',
};