/*
 * name validation
 * accepted: letters, spaces, hyphens, apostrophes
 */
export const name: RegExp = /^[\p{L} \-']{2,}$/u;

/*
 * email validation
 */
export const email: RegExp = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;

/*
 * password validation, should contain:
 * (?=.*\d): at least one digit
 * (?=.*[a-z]): at least one lower case
 * (?=.*[A-Z]): at least one uppercase case
 * !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?: allowed special characters
 * Minimum 8 characters (matching backend validation)
 */
export const password: RegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,50}$/;