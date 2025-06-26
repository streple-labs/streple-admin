export const passwordValidation = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  let message = "";

  if (!checks.length) message = "At least 8 characters";
  else if (!checks.uppercase) message = "At least one uppercase letter";
  else if (!checks.lowercase) message = "At least one lowercase letter";
  else if (!checks.number) message = "At least one number";
  else if (!checks.special) message = "At least one special character";
  else message = "All requirements met";

  const passedChecks = Object.values(checks).filter(Boolean).length;

  return {
    message,
    passedChecks,
  };
};
