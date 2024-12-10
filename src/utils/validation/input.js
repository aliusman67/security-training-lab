export function validateUsername(username) {
  return {
    valid: username && username.length >= 3 && username.length <= 30,
    error: 'Username must be between 3 and 30 characters'
  };
}

export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const valid = password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar;

  return {
    valid,
    error: valid ? null : 'Password must be at least 8 characters and contain uppercase, lowercase, numbers, and special characters'
  };
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    valid: emailRegex.test(email),
    error: 'Invalid email format'
  };
}