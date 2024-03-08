/**
 * Validates the first name field.
 *
 * @param {string} firstname - The first name to validate.
 * @throws {Error} If the first name is missing or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidFirstName = (firstname) =>
  !firstname.trim()
    ? "Champ obligatoire."
    : /^[a-zA-ZÀ-ÿ-' ]+$/u.test(firstname)
    ? ""
    : "Les caractères spéciaux et chiffres ne sont pas autorisés.";

/**
 * Validates the last name field.
 *
 * @param {string} lastname - The last name to validate.
 * @throws {Error} If the last name is missing or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidLastName = (lastname) =>
  !lastname.trim()
    ? "Champ obligatoire."
    : /^[a-zA-ZÀ-ÿ-' ]+$/u.test(lastname)
    ? ""
    : "Les caractères spéciaux et chiffres ne sont pas autorisés.";

/**
 * Validates the email field.
 *
 * @param {string} email - The email address to validate.
 * @throws {Error} If the email is missing, not valid, or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidEmail = (email) =>
  !email.trim()
    ? "Champ obligatoire."
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? ""
    : "L'email est invalide.";

/**
 * Validates the postal code field.
 *
 * @param {string} postalCode - The postal code to validate.
 * @throws {Error} If the postal code is missing, not a 5-digit number, or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidPostalCode = (postalCode) =>
  !postalCode.trim()
    ? "Champ obligatoire."
    : /^\d{5}$/.test(postalCode)
    ? ""
    : "Le code postal doit être composé de 5 chiffres.";

/**
 * Validates the city field.
 *
 * @param {string} city - The city name to validate.
 * @throws {Error} If the city is missing or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidCity = (city) =>
  !city.trim()
    ? "Champ obligatoire."
    : /^[a-zA-ZÀ-ÿ-]+$/u.test(city)
    ? ""
    : "Les caractères spéciaux et chiffres ne sont pas autorisés.";

/**
 * Validates the date of birth field.
 *
 * @param {string} dateBirth - The date of birth to validate.
 * @throws {Error} If the date of birth is missing, invalid, or greater than today.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidDateBirth = (dateBirth) => {
  const birthDate = new Date(dateBirth);
  const currentDate = new Date();

  if (!(birthDate instanceof Date && !isNaN(birthDate))) {
    return "La date de naissance est invalide.";
  }

  if (birthDate > currentDate) {
    return "La date de naissance ne peut pas être dans le futur.";
  }

  return "";
};
