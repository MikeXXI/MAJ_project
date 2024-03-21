/**
 * Calculate a person's age in years.
 *
 * @param {object} p - The person object with a 'birth' property of type Date.
 * @throws Will throw an error if the parameter is missing, not an object,
 *         or if the 'birth' property is missing, not a Date object, or if
 *         the date is invalid or greater than today.
 * @return {number} - The age of the person in years.
 */
export function calculateAge(p) {
  if (!p) {
    throw new Error("Missing parameter: 'p'");
  }

  if (typeof p !== "object") {
    throw new Error("Invalid parameter type: 'p' must be an object");
  }

  if (!("birth" in p)) {
    throw new Error("Missing property: 'birth' property is required");
  }

  const birthDate = new Date(p.birth);

  if (!(birthDate instanceof Date && !isNaN(birthDate))) {
    throw new Error("Invalid Date object: 'birth' must be a valid Date");
  }

  if (birthDate > new Date()) {
    throw new Error(
      "Invalid birth date: 'birth' should not be greater than today"
    );
  }

  const dateDiff = new Date(Date.now() - birthDate.getTime());
  return Math.abs(dateDiff.getUTCFullYear() - 1970);
}
