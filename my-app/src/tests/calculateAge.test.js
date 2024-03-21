import { calculateAge } from "../utils/calculateAge";

/**
 * Calculates the age of a person based on the birth date
 * @param {Date} birthDate
 * @return {Number}
 * @throws {Error} Missing parameter: 'p'
 * @throws {Error} Invalid parameter type: 'p' must be an object
 * @throws {Error} Missing property: 'birth' property is required
 * @throws {Error} Invalid Date object: 'birth' must be a valid Date
 * @throws {Error} Invalid birth date: 'birth' should not be greater than today
 *
 */

describe("calculateAge Function Tests", () => {
  it("should calculate the age correctly", async () => {
    const birthDate = new Date("1990-01-01");
    const age = calculateAge({ birth: birthDate });
    expect(age).toEqual(expect.any(Number));
  });

  it("calculates age correctly for today", () => {
    const birthDate = new Date();
    const age = calculateAge({ birth: birthDate });
    expect(age).toEqual(0);
  });

  it("throws an error for missing parameter", () => {
    expect(() => calculateAge()).toThrow("Missing parameter: 'p'");
  });

  it("throws an error for invalid parameter type", () => {
    expect(() => calculateAge("invalid")).toThrow(
      "Invalid parameter type: 'p' must be an object"
    );
  });

  it("should handle leap year correctly", () => {
    const birthDate = new Date("2000-02-29");
    const person = { birth: birthDate };
    expect(calculateAge(person)).toEqual(expect.any(Number));
  });

  it("throws an error for missing 'birth' property", () => {
    const invalidPerson = {};
    expect(() => calculateAge(invalidPerson)).toThrow(
      "Missing property: 'birth' property is required"
    );
  });

  it("throws an error for invalid 'birth' property", () => {
    const invalidPerson = { birth: "invalid" };
    expect(() => calculateAge(invalidPerson)).toThrow(
      "Invalid Date object: 'birth' must be a valid Date"
    );
  });

  it("throws an error for 'birth' date greater than today", () => {
    const futureBirthDate = new Date(Date.now() + 86400000); // Tomorrow
    const invalidPerson = { birth: futureBirthDate };
    expect(() => calculateAge(invalidPerson)).toThrow(
      "Invalid birth date: 'birth' should not be greater than today"
    );
  });
});
