/**
 * Set first char of string to uppercase
 * @param string
 * @returns {string}
 */
export const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1);
