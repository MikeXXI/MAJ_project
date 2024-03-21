import {
  isValidFirstName,
  isValidLastName,
  isValidEmail,
  isValidPostalCode,
  isValidCity,
  isValidDateBirth,
} from "../utils/validations";

describe("Validation Functions Tests", () => {
  describe("isValidFirstName", () => {
    it("should return an empty string for a valid first name", () => {
      const result = isValidFirstName("John");
      expect(result).toBe("");
    });

    it("should return 'Champ obligatoire.' for an empty first name", () => {
      const result = isValidFirstName("");
      expect(result).toBe("Champ obligatoire.");
    });

    it("should return 'Les caractères spéciaux et chiffres ne sont pas autorisés.' for a first name with special characters", () => {
      const result = isValidFirstName("John@123");
      expect(result).toBe(
        "Les caractères spéciaux et chiffres ne sont pas autorisés."
      );
    });

    it("should return '' for a first name with accented characters", () => {
      const result = isValidFirstName("Élise");
      expect(result).toBe("");
    });

    it("should return '' for a first name with a hyphen", () => {
      const result = isValidFirstName("Jean-Pierre");
      expect(result).toBe("");
    });

    it("should return '' for a first name with a space", () => {
      const result = isValidFirstName("Jean Pierre");
      expect(result).toBe("");
    });

    it("should return '' for a first name with a single quote", () => {
      const result = isValidFirstName("Jean d'Arc");
      expect(result).toBe("");
    });
    
  });

  describe("isValidLastName", () => {
    it("should return an empty string for a valid last name", () => {
      const result = isValidLastName("Doe");
      expect(result).toBe("");
    });

    it("should return 'Champ obligatoire.' for an empty last name", () => {
      const result = isValidLastName("");
      expect(result).toBe("Champ obligatoire.");
    });

    it("should return 'Les caractères spéciaux et chiffres ne sont pas autorisés.' for a last name with special characters", () => {
      const result = isValidLastName("xxx@xxx");
      expect(result).toBe(
        "Les caractères spéciaux et chiffres ne sont pas autorisés."
      );
    });

    it("should return '' for a last name with accented characters", () => {
      const result = isValidLastName("Lévy");
      expect(result).toBe("");
    });
  });

  describe("isValidEmail", () => {
    it("should return an empty string for a valid email", () => {
      const result = isValidEmail("test@example.com");
      expect(result).toBe("");
    });

    it("should return 'Champ obligatoire.' for an empty email", () => {
      const result = isValidEmail("");
      expect(result).toBe("Champ obligatoire.");
    });

    it("should return 'Adresse email invalide.' for an invalid email", () => {
      const result = isValidEmail("invalid.email");
      expect(result).toBe("L'email est invalide.");
    });
  });

  describe("isValidPostalCode", () => {
    it("should return an empty string for a valid postal code", () => {
      const result = isValidPostalCode("75000");
      expect(result).toBe("");
    });

    it("should return 'Champ obligatoire.' for an empty postal code", () => {
      const result = isValidPostalCode("");
      expect(result).toBe("Champ obligatoire.");
    });

    it("should return 'Le code postal doit être composé de 5 chiffres.' for an invalid postal code", () => {
      const result = isValidPostalCode("invalid");
      expect(result).toBe("Le code postal doit être composé de 5 chiffres.");
    });
  });

  describe("isValidCity", () => {
    it("should return an empty string for a valid city", () => {
      const result = isValidCity("Paris");
      expect(result).toBe("");
    });

    it("should return 'Champ obligatoire.' for an empty city", () => {
      const result = isValidCity("");
      expect(result).toBe("Champ obligatoire.");
    });

    it("should return 'Les caractères spéciaux et chiffres ne sont pas autorisés.' for a city with special characters", () => {
      const result = isValidCity("xxxxx@xxx");
      expect(result).toBe(
        "Les caractères spéciaux et chiffres ne sont pas autorisés."
      );
    });

    it("should return '' for a city with accented characters", () => {
      const result = isValidCity("Marseille");
      expect(result).toBe("");
    });

    describe("isValidDateBirth", () => {
      it("should return '' for a valid date of birth", () => {
        const result = isValidDateBirth("1990-01-01");
        expect(result).toBe("");
      });

      it("should return 'La date de naissance est invalide.' for an invalid date", () => {
        const result = isValidDateBirth("invalid-date");
        expect(result).toBe("La date de naissance est invalide.");
      });

      it("should return 'La date de naissance ne peut pas être dans le futur.' for a future date", () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const result = isValidDateBirth(futureDate.toISOString());
        expect(result).toBe(
          "La date de naissance ne peut pas être dans le futur."
        );
      });
    });
  });
});
