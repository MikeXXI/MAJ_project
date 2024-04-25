/**
 * Validates the first name field.
 *
 * @param {string} firstname - The first name to validate.
 * @throws {Error} If the first name is missing or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidFirstName = (firstname) => {
  if (!firstname.trim()) {
    return "Champ obligatoire.";
  } else {
    const isValid = /^[a-zA-ZÀ-ÿ-' ]+$/u.test(firstname);
    if (isValid) {
      return "";
    } else {
      return "Les caractères spéciaux et chiffres ne sont pas autorisés.";
    }
  }
};

/**
 * Validates the last name field.
 *
 * @param {string} lastname - The last name to validate.
 * @throws {Error} If the last name is missing or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidLastName = (lastname) => {
  if (!lastname.trim()) {
    return "Champ obligatoire.";
  } else {
    const isValid = /^[a-zA-ZÀ-ÿ-' ]+$/u.test(lastname);
    if (isValid) {
      return "";
    } else {
      return "Les caractères spéciaux et chiffres ne sont pas autorisés.";
    }
  }
};

/**
 * Validates the email field.
 *
 * @param {string} email - The email address to validate.
 * @throws {Error} If the email is missing, not valid, or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidEmail = (email) => {
  if (!email.trim()) {
    return "Champ obligatoire.";
  } else {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (isValid) {
      return "";
    } else {
      return "L'email est invalide.";
    }
  }
};

/**
 * Validates the postal code field.
 *
 * @param {string} postalCode - The postal code to validate.
 * @throws {Error} If the postal code is missing, not a 5-digit number, or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidPostalCode = (postalCode) => {
  if (!postalCode.trim()) {
    return "Champ obligatoire.";
  } else {
    const isValid = /^\d{5}$/.test(postalCode);
    if (isValid) {
      return "";
    } else {
      return "Le code postal doit être composé de 5 chiffres.";
    }
  }
};

/**
 * Validates the city field.
 *
 * @param {string} city - The city name to validate.
 * @throws {Error} If the city is missing or contains invalid characters.
 * @return {string} An error message if the validation fails, otherwise an empty string.
 */
export const isValidCity = (city) => {
  if (!city.trim()) {
    return "Champ obligatoire.";
  } else {
    const trimmedCity = city.trim();
    const regex = /^[a-zA-ZÀ-ÿ-' ]+$/u;
    const isValid = regex.test(trimmedCity);
    if (isValid) {
      return "";
    } else {
      return "Les caractères spéciaux et chiffres ne sont pas autorisés.";
    }
  }
};

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
