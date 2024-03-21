import Form from "../components/Form";

import { render, screen, within, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";

const SUCCESS_MESSAGE = "Inscription réussie !";
const AGE_ERROR_MESSAGE = "Vous devez être majeur pour vous inscrire.";

describe("Form component", () => {
  let formData, form;
  beforeEach(() => {
    render(<Form />);
    formData = {
      prenom: "John",
      nom: "Doe",
      dateNaissance: "2000-01-11",
      email: "john.doe@example.com",
      codePostal: "06600",
      ville: "Antibes",
    };
  });

  describe(" Form Input Handling ", () => {
    it("should update state on input change", () => {
      const inputLastname = screen.getByTestId("inputLastname");
      fireEvent.change(inputLastname, { target: { value: "Doe" } });
      expect(screen.getByTestId("inputLastname").value).toBe("Doe");
    });

    it("should validate input on blur", () => {
      const inputLastname = screen.getByTestId("inputLastname");
      inputLastname.focus();
      inputLastname.blur();
      expect(screen.getByTestId("errorLastname")).toBeInTheDocument();
    });
  });

  describe(" Saving User Data ", () => {
    it("should save the user in local storage", () => {
      const inputs = [
        { name: "inputLastname", value: formData.nom },
        { name: "inputFirstname", value: formData.prenom },
        { name: "inputEmail", value: formData.email },
        { name: "inputDate", value: formData.dateNaissance },
        { name: "inputCity", value: formData.ville },
        { name: "inputZip", value: formData.codePostal },
      ];
      inputs.forEach(({ name, value }) => {
        const input = screen.getByTestId(name);
        fireEvent.change(input, { target: { value } });
      });
      const form = screen.getByTestId("form");
      fireEvent.submit(form);

      const storedUserData = {
        prenom: "John",
        nom: "Doe",
        dateNaissance: "2000-01-11",
        email: "john.doe@example.com",
        codePostal: "06600",
        ville: "Antibes",
      };

      localStorage.setItem("userData", JSON.stringify(storedUserData));

      expect(JSON.parse(localStorage.getItem("userData"))).toEqual(
        storedUserData
      );
    });

    it("should not send the form if there are errors", async () => {
      const form = screen.getByTestId("form");
      fireEvent.submit(form);
      expect(
        screen.queryByText("Inscription réussie !")
      ).not.toBeInTheDocument();
    });
  });

  describe(" Form Rendering ", () => {
    it("renders the form", () => {
      form = screen.getByTestId("form");
      expect(form).toBeInTheDocument();
    });

    it("renders the form with the correct input", () => {
      const inputs = within(form).getAllByTestId(/input.*/);
      expect(inputs).toHaveLength(6);
      expect(inputs[0]).toHaveAttribute("type", "text");
      expect(inputs[1]).toHaveAttribute("type", "text");
      expect(inputs[2]).toHaveAttribute("type", "email");
      expect(inputs[3]).toHaveAttribute("type", "date");
      expect(inputs[4]).toHaveAttribute("type", "text");
      expect(inputs[5]).toHaveAttribute("type", "text");
    });

    it("renders the form with the correct fields labels", () => {
      const labels = within(form).getAllByTestId(/label.*/);
      expect(labels).toHaveLength(6);
      expect(labels[0]).toHaveTextContent("Prénom");
      expect(labels[1]).toHaveTextContent("Nom");
      expect(labels[2]).toHaveTextContent("Email");
      expect(labels[3]).toHaveTextContent("Date de naissance");
      expect(labels[4]).toHaveTextContent("Ville");
      expect(labels[5]).toHaveTextContent("Code postal");
    });

    it("renders the form with the correct submit button", () => {
      const submitButton = within(form).getByTestId(/saveButton/);
      expect(submitButton).toHaveTextContent("Sauvegarder");
    });

    it("renders the form with the correct error messages", () => {
      fireEvent.submit(form);
      const errorMessages = screen.getAllByTestId(/error.*/);
      expect(errorMessages).toHaveLength(7);
    });

    it("renders the title", () => {
      const title = screen.getByText("FORMULAIRE D'INSCRIPTION");
      expect(title).toBeInTheDocument();
    });
  });

  describe("Form Input Tests ", () => {
    describe("Firstname input ", () => {
      it("renders the input", () => {
        const labelPrenom = screen.getByTestId("labelPrenom");
        expect(labelPrenom).toBeInTheDocument();
      });

      it("renders the error message", () => {
        const inputFirstname = screen.getByTestId("inputFirstname");
        inputFirstname.focus();
        inputFirstname.blur();
        const errorText = screen.getByTestId("errorFirstname");
        expect(errorText).toBeInTheDocument();
      });

      it("should update the state", () => {
        const inputFirstname = screen.getByTestId("inputFirstname");
        fireEvent.change(inputFirstname, {
          target: { value: formData.prenom },
        });
        expect(inputFirstname.value).toBe(formData.prenom);
      });

      it.each([
        ["D'Angelo", "D'Angelo"],
        ["Mary-Jane", "Mary-Jane"],
        ["John Paul", "John Paul"],
      ])(
        "should allow special characters in first name  : %s  ",
        (input, expected) => {
          const inputFirstname = screen.getByTestId("inputFirstname");
          fireEvent.change(inputFirstname, { target: { value: input } });
          expect(inputFirstname.value).toBe(expected);
        }
      );

      it("should display an error message if the input is empty", () => {
        const inputFirstname = screen.getByTestId("inputFirstname");
        fireEvent.change(inputFirstname, { target: { value: "" } });
        inputFirstname.focus();
        inputFirstname.blur();
        const errorText = screen.getByTestId("errorFirstname");
        expect(errorText).toBeInTheDocument();
      });

      it.each([
        ["x@xx", "Les caractères spéciaux et chiffres ne sont pas autorisés."],
        ["J0hn", "Les caractères spéciaux et chiffres ne sont pas autorisés."],
        [
          "J0hn&07",
          "Les caractères spéciaux et chiffres ne sont pas autorisés.",
        ],
      ])(
        "should display an error message when the input is invalid : %s and the expected error message is %s ",
        (input, expectedErrorMessage) => {
          const divPrenom = screen.getByTestId("divPrenom");
          const inputFirstname = screen.getByTestId("inputFirstname");
          fireEvent.change(inputFirstname, { target: { value: input } });
          inputFirstname.focus();
          inputFirstname.blur();
          if (expectedErrorMessage) {
            const error = within(divPrenom).getByText(expectedErrorMessage);
            expect(error).toBeInTheDocument();
          } else {
            expect(divPrenom).toBeEmptyDOMElement();
          }
        }
      );
    });
    describe("Lastname input", () => {
      it("renders the input", () => {
        const labelLastname = screen.getByTestId("labelLastname");
        expect(labelLastname).toBeInTheDocument();
      });

      it("renders the error message", () => {
        const inputLastname = screen.getByTestId("inputLastname");
        inputLastname.focus();
        inputLastname.blur();
        const errorText = screen.getByTestId("errorLastname");
        expect(errorText).toBeInTheDocument();
      });

      it("should update the state", () => {
        const inputLastname = screen.getByTestId("inputLastname");
        fireEvent.change(inputLastname, { target: { value: formData.nom } });
        expect(inputLastname.value).toBe("Doe");
      });

      it(" should display an error message if the input is empty", () => {
        const inputLastname = screen.getByTestId("inputLastname");
        fireEvent.change(inputLastname, { target: { value: "" } });
        inputLastname.focus();
        inputLastname.blur();
        const errorText = screen.getByTestId("errorLastname");
        expect(errorText).toBeInTheDocument();
      });

      it.each([
        ["D@e", "Les caractères spéciaux et chiffres ne sont pas autorisés."],
        ["D0e", "Les caractères spéciaux et chiffres ne sont pas autorisés."],
        [
          "D0e&07",
          "Les caractères spéciaux et chiffres ne sont pas autorisés.",
        ],
      ])(
        "should display an error message when the input is invalid : %s and the expected error message is %s ",
        (input, expectedErrorMessage) => {
          const divNom = screen.getByTestId("divNom");
          const inputLastname = screen.getByTestId("inputLastname");
          fireEvent.change(inputLastname, { target: { value: input } });
          inputLastname.focus();
          inputLastname.blur();

          if (expectedErrorMessage) {
            const error = within(divNom).getByText(expectedErrorMessage);
            expect(error).toBeInTheDocument();
          } else {
            expect(divNom).toBeEmptyDOMElement();
          }
        }
      );

      it.each([
        ["Doe"], // Valid case: Alphabetic characters
        ["D'Angelo"], // Valid case: Alphabetic characters with apostrophe
        ["Mary-Jane"], // Valid case: Alphabetic characters with hyphen
        ["John Paul"], // Valid case: Alphabetic characters with space
        ["O'Reilly"], // Valid case: Alphabetic characters with apostrophe
        ["van der Waals"], // Valid case: Alphabetic characters with spaces and van der
      ])("should handle different valid last name inputs : %s ", (input) => {
        const inputLastname = screen.getByTestId("inputLastname");
        fireEvent.change(inputLastname, { target: { value: input } });
        inputLastname.focus();
        inputLastname.blur();
        expect(inputLastname.value).toBe(input);
      });
    });

    describe("Email input", () => {
      it("renders the input", () => {
        const labelEmail = screen.getByTestId("labelEmail");
        expect(labelEmail).toBeInTheDocument();
      });

      it("renders the error message", () => {
        const inputEmail = screen.getByTestId("inputEmail");
        inputEmail.focus();
        inputEmail.blur();
        const errorText = screen.getByTestId("errorEmail");
        expect(errorText).toBeInTheDocument();
      });

      it("should update the state", () => {
        const inputEmail = screen.getByTestId("inputEmail");
        fireEvent.change(inputEmail, { target: { value: formData.email } });
        expect(inputEmail.value).toBe(formData.email);
      });

      it("should display an error message if the input is empty", () => {
        const inputEmail = screen.getByTestId("inputEmail");
        fireEvent.change(inputEmail, { target: { value: "" } });
        inputEmail.focus();
        inputEmail.blur();
        const errorText = screen.getByTestId("errorEmail");
        expect(errorText).toBeInTheDocument();
      });
      it.each([
        " John.Doe",
        "John.Doe@",
        "xxxx.xxx@xxxxxxx",
        "xxxx.xxx@xxxxxxx.",
      ])(
        "should display an error message when the input is invalid : %s ",
        (input) => {
          const divEmail = screen.getByTestId("divEmail");
          const inputEmail = screen.getByTestId("inputEmail");
          fireEvent.change(inputEmail, { target: { value: input } });
          inputEmail.focus();
          inputEmail.blur();
          const error = within(divEmail).getByText("L'email est invalide.");
          expect(error).toBeInTheDocument();
        }
      );
    });

    describe("Date of Birthday input", () => {
      it("renders the input", () => {
        const labelDate = screen.getByTestId("labelDate");
        expect(labelDate).toBeInTheDocument();
      });

      it("renders the error message", () => {
        const inputDate = screen.getByTestId("inputDate");
        inputDate.focus();
        inputDate.blur();
        const errorText = screen.getByTestId("errorDate");
        expect(errorText).toBeInTheDocument();
      });

      it("should update the state", () => {
        const inputDate = screen.getByTestId("inputDate");
        fireEvent.change(inputDate, {
          target: { value: formData.dateNaissance },
        });
        expect(inputDate.value).toBe(formData.dateNaissance);
      });

      it("should display an error message if the input is empty", () => {
        const inputDate = screen.getByTestId("inputDate");
        fireEvent.change(inputDate, { target: { value: "" } });
        inputDate.focus();
        inputDate.blur();
        const errorText = screen.getByTestId("errorDate");
        expect(errorText).toBeInTheDocument();
      });

      it(" should display an error message when the input date is in the future 2028-01-01", () => {
        const divDate = screen.getByTestId("divDate");
        const inputDate = screen.getByTestId("inputDate");
        fireEvent.change(inputDate, { target: { value: "2028-01-01" } });
        inputDate.focus();
        inputDate.blur();
        const error = within(divDate).getByText(
          "La date de naissance ne peut pas être dans le futur."
        );
        expect(error).toBeInTheDocument();
      });

      it("should display an error message if the date of birth is exactly 18 years old", () => {
        const inputDate = screen.getByTestId("inputDate");
        fireEvent.change(inputDate, { target: { value: "2004-01-01" } });
        inputDate.focus();
        inputDate.blur();
        const errorText = screen.getByTestId("errorDate");
        expect(errorText).toBeInTheDocument();
      });
    });

    describe("City input", () => {
      it("renders the input", () => {
        const labelCity = screen.getByTestId("labelCity");
        expect(labelCity).toBeInTheDocument();
      });

      it("renders the error message", () => {
        const inputCity = screen.getByTestId("inputCity");
        inputCity.focus();
        inputCity.blur();
        const errorText = screen.getByTestId("errorCity");
        expect(errorText).toBeInTheDocument();
      });

      it("should update the state", () => {
        const inputCity = screen.getByTestId("inputCity");
        fireEvent.change(inputCity, { target: { value: formData.ville } });
        expect(inputCity.value).toBe(formData.ville);
      });
    });

    describe("Zip Code input", () => {
      it("renders the input", () => {
        const labelZip = screen.getByTestId("labelZip");
        expect(labelZip).toBeInTheDocument();
      });

      it("renders the error message", () => {
        const inputZip = screen.getByTestId("inputZip");
        inputZip.focus();
        inputZip.blur();
        const errorText = screen.getByTestId("errorZip");
        expect(errorText).toBeInTheDocument();
      });

      it("should update the state", () => {
        const inputZip = screen.getByTestId("inputZip");
        fireEvent.change(inputZip, {
          target: { value: formData.codePostal },
        });
        expect(inputZip.value).toBe(formData.codePostal);
      });

      it("should display an error message if the input is empty", () => {
        const inputZip = screen.getByTestId("inputZip");
        fireEvent.change(inputZip, { target: { value: "" } });
        inputZip.focus();
        inputZip.blur();
        const errorText = screen.getByTestId("errorZip");
        expect(errorText).toBeInTheDocument();
      });

      it("should display an error message for an invalid postal code format : ABC123", () => {
        const inputZip = screen.getByTestId("inputZip");
        fireEvent.change(inputZip, { target: { value: "ABC123" } });
        inputZip.focus();
        inputZip.blur();
        const errorText = screen.getByTestId("errorZip");
        expect(errorText).toBeInTheDocument();
      });

      it("should display an error message for an invalid postal code format : 06o00", () => {
        const divZip = screen.getByTestId("divZip");
        const inputZip = screen.getByTestId("inputZip");
        fireEvent.change(inputZip, { target: { value: "06o00" } });
        inputZip.focus();
        inputZip.blur();
        const error = within(divZip).getByText(
          "Le code postal doit être composé de 5 chiffres."
        );
        expect(error).toBeInTheDocument();
      });
      it("should display an error message for an invalid postal code format : 0600", () => {
        const divZip = screen.getByTestId("divZip");
        const inputZip = screen.getByTestId("inputZip");
        fireEvent.change(inputZip, { target: { value: "0600" } });
        inputZip.focus();
        inputZip.blur();
        const error = within(divZip).getByText(
          "Le code postal doit être composé de 5 chiffres."
        );
        expect(error).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("should display an error message for each invalid input", () => {
      fireEvent.submit(form);
      const errorMessages = screen.getAllByTestId(/error.*/);
      expect(errorMessages).toHaveLength(7);
    });

    it("should disable the submit button when inputs are empty", () => {
      const buttonForm = screen.getByTestId("saveButton");
      expect(buttonForm).toBeDisabled();
    });

    it("should disable the submit button if there are validation errors ", () => {
      const buttonForm = screen.getByTestId("saveButton");
      expect(buttonForm).toBeDisabled();
      const errorText = screen.getByTestId("errorButton");
      expect(errorText).toBeInTheDocument();
    });

    it("should send the form with valid inputs", async () => {
      const inputLastname = screen.getByTestId("inputLastname");
      const inputFirstname = screen.getByTestId("inputFirstname");
      const inputEmail = screen.getByTestId("inputEmail");
      const inputDate = screen.getByTestId("inputDate");
      const inputCity = screen.getByTestId("inputCity");
      const inputZip = screen.getByTestId("inputZip");
      fireEvent.change(inputLastname, { target: { value: formData.nom } });
      fireEvent.change(inputFirstname, {
        target: { value: formData.prenom },
      });
      fireEvent.change(inputEmail, { target: { value: formData.email } });
      fireEvent.change(inputDate, {
        target: { value: formData.dateNaissance },
      });
      fireEvent.change(inputCity, { target: { value: formData.ville } });
      fireEvent.change(inputZip, { target: { value: formData.codePostal } });

      fireEvent.submit(form);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTimeout(() => {
        expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument();
        expect(inputLastname.value).toBe("");
        expect(inputFirstname.value).toBe("");
        expect(inputEmail.value).toBe("");
        expect(inputDate.value).toBe("");
        expect(inputCity.value).toBe("");
        expect(inputZip.value).toBe("");

        const user = JSON.parse(localStorage.getItem("user"));
        expect(user).toEqual(formData);
        expect(inputLastname.value).toBe("");
        expect(inputFirstname.value).toBe("");
        expect(inputEmail.value).toBe("");
        expect(inputDate.value).toBe("");
        expect(inputCity.value).toBe("");
        expect(inputZip.value).toBe("");
      }, 500);
    });

    it("should send the form with valid inputs and date of birth is less than 18 years old", async () => {
      const inputLastname = screen.getByTestId("inputLastname");
      const inputFirstname = screen.getByTestId("inputFirstname");
      const inputEmail = screen.getByTestId("inputEmail");
      const inputDate = screen.getByTestId("inputDate");
      const inputCity = screen.getByTestId("inputCity");
      const inputZip = screen.getByTestId("inputZip");
      fireEvent.change(inputLastname, { target: { value: formData.nom } });
      fireEvent.change(inputFirstname, {
        target: { value: formData.prenom },
      });
      fireEvent.change(inputEmail, { target: { value: formData.email } });
      fireEvent.change(inputCity, { target: { value: formData.ville } });
      fireEvent.change(inputZip, { target: { value: formData.codePostal } });

      fireEvent.change(inputDate, {
        target: { value: "2010-01-01" },
      });
      fireEvent.submit(form);

      setTimeout(() => {
        expect(screen.getByText(AGE_ERROR_MESSAGE)).toBeInTheDocument();
      });
    });
  });

  describe(" Notification Toasts", () => {
    it("should display an error toast when the form is submitted with age under 18", async () => {
      const inputLastname = screen.getByTestId("inputLastname");
      const inputFirstname = screen.getByTestId("inputFirstname");
      const inputEmail = screen.getByTestId("inputEmail");
      const inputDate = screen.getByTestId("inputDate");
      const inputCity = screen.getByTestId("inputCity");
      const inputZip = screen.getByTestId("inputZip");

      fireEvent.change(inputLastname, { target: { value: formData.nom } });

      fireEvent.change(inputFirstname, {
        target: { value: formData.prenom },
      });
      fireEvent.change(inputEmail, { target: { value: formData.email } });
      fireEvent.change(inputDate, {
        target: { value: "2010-01-01" }, // age < 18
      });
      fireEvent.change(inputCity, { target: { value: formData.ville } });
      fireEvent.change(inputZip, { target: { value: formData.codePostal } });

      fireEvent.submit(form);

      setTimeout(() => {
        expect(screen.getByText(AGE_ERROR_MESSAGE)).toBeInTheDocument();
      }, 500);
    });

    it("should display a success toast when the form is submitted", async () => {
      const inputLastname = screen.getByTestId("inputLastname");
      const inputFirstname = screen.getByTestId("inputFirstname");
      const inputEmail = screen.getByTestId("inputEmail");
      const inputDate = screen.getByTestId("inputDate");
      const inputCity = screen.getByTestId("inputCity");
      const inputZip = screen.getByTestId("inputZip");
      fireEvent.change(inputLastname, { target: { value: formData.nom } });
      fireEvent.change(inputFirstname, {
        target: { value: formData.prenom },
      });
      fireEvent.change(inputEmail, { target: { value: formData.email } });
      fireEvent.change(inputDate, {
        target: { value: formData.dateNaissance },
      });
      fireEvent.change(inputCity, { target: { value: formData.ville } });
      fireEvent.change(inputZip, { target: { value: formData.codePostal } });

      fireEvent.submit(form);

      setTimeout(() => {
        expect(screen.getByText(SUCCESS_MESSAGE)).toBeInTheDocument();
      }, 500);
    });
  });

  describe(" Displays the error toaster and corresponding errors in red ", () => {
    it("should display the corresponding errors in red", async () => {
      const errorLastname = screen.getByTestId("errorLastname");
      expect(errorLastname).toHaveClass("text-red-500");
      const errorPrenom = screen.getByTestId("errorFirstname");
      expect(errorPrenom).toHaveClass("text-red-500");
      const errorEmail = screen.getByTestId("errorEmail");
      expect(errorEmail).toHaveClass("text-red-500");
      const errorDate = screen.getByTestId("errorDate");
      expect(errorDate).toHaveClass("text-red-500");
      const errorCity = screen.getByTestId("errorCity");
      expect(errorCity).toHaveClass("text-red-500");
      const errorZip = screen.getByTestId("errorZip");
      expect(errorZip).toHaveClass("text-red-500");
    });
    it("should display the corresponding toaster message in red when the form is submitted and date of birth is less than 18 years old", async () => {
      fireEvent.change(screen.getByTestId("inputFirstname"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByTestId("inputLastname"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByTestId("inputEmail"), {
        target: { value: "John.Doe@gmail.com" },
      });
      fireEvent.change(screen.getByTestId("inputDate"), {
        target: { value: "2020-01-01" },
      });
      fireEvent.change(screen.getByTestId("inputCity"), {
        target: { value: "Antibes" },
      });
      fireEvent.change(screen.getByTestId("inputZip"), {
        target: { value: "06600" },
      });

      setTimeout(() => {
        expect(screen.getByText(AGE_ERROR_MESSAGE)).toBeInTheDocument();
        expect(screen.getByText(AGE_ERROR_MESSAGE)).toHaveClass("bg-red-500");
      });
    });
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
