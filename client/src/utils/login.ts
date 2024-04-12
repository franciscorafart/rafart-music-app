export const signUpPasswordValid = (pw: string) => {
  // Regular expressions for each condition
  const lengthRegex = /.{8,}/;
  const letterRegex = /[a-zA-Z]/;
  const numberRegex = /\d/;
  // const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;

  // Check each condition
  const hasLength = lengthRegex.test(pw);
  const hasLetter = letterRegex.test(pw);
  const hasNumber = numberRegex.test(pw);
  // const hasSymbol = symbolRegex.test(pw);

  // Return true if all conditions are met, otherwise false
  return hasLength && hasLetter && hasNumber;
};
export const passwordValid = (pw1: string) => pw1.length >= 8;

export const isRepeatValid = (pw1: string, pw2: string) =>
  passwordValid(pw1) && pw1 === pw2;

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const goHome = () => {
  window.location.href = "/";
};

export const goFans = () => {
  window.location.href = "/fans";
};
export const goLogin = () => {
  window.location.href = "/login";
};

export const goAdmin = () => {
  window.location.href = "/admin";
};
