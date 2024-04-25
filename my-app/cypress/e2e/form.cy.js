describe("Registration Form Display", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("loads the form", () => {
    cy.get('[data-testid="form"]').should("be.visible");
  });

  it("allows input to be entered", () => {
    cy.get('[data-testid="inputFirstname"]')
      .type("John")
      .should("have.value", "John");
    cy.get('[data-testid="inputLastname"]')
      .type("Doe")
      .should("have.value", "Doe");
    cy.get('[data-testid="inputEmail"]')
      .type("john.doe@gmail.com")
      .should("have.value", "john.doe@gmail.com");
    cy.get('[data-testid="inputDate"]')
      .type("1990-01-01")
      .should("have.value", "1990-01-01");
    cy.get('[data-testid="inputCity"]')
      .type("New York")
      .should("have.value", "New York");
    cy.get('[data-testid="inputZip"]')
      .type("10001")
      .should("have.value", "10001");
  });

  it("shows error messages for invalid inputs", () => {
    // Invalid first name (numbers)
    cy.get('[data-testid="inputFirstname"]').type("123").blur();
    cy.get('[data-testid="errorFirstname"]').should(
      "contain",
      "Les caractères spéciaux et chiffres ne sont pas autorisés."
    );

    // Invalid last name (special characters)
    cy.get('[data-testid="inputLastname"]').type("Doe!").blur();
    cy.get('[data-testid="errorLastname"]').should(
      "contain",
      "Les caractères spéciaux et chiffres ne sont pas autorisés."
    );

    // Invalid email
    cy.get('[data-testid="inputEmail"]').type("john.doe").blur();
    cy.get('[data-testid="errorEmail"]').should(
      "contain",
      "L'email est invalide."
    );

    //Date in the future
    cy.get('[data-testid="inputDate"]').type("2032-01-01").blur();
    cy.get('[data-testid="errorDate"]').should(
      "contain",
      "La date de naissance ne peut pas être dans le futur."
    );

    // Invalid city (special characters)
    cy.get('[data-testid="inputCity"]').type("Antibes!").blur();
    cy.get('[data-testid="errorCity"]').should(
      "contain",
      "Les caractères spéciaux et chiffres ne sont pas autorisés."
    );

    // Invalid zip code (letters)
    cy.get('[data-testid="inputZip"]').type("ABCD").blur();
    cy.get('[data-testid="errorZip"]').should(
      "contain",
      "Le code postal doit être composé de 5 chiffres."
    );
  });

  it("updates validation messages dynamically as user corrects input", () => {
    cy.get('[data-testid="inputFirstname"]').type("123").blur();
    cy.get('[data-testid="errorFirstname"]').should(
      "contain",
      "Les caractères spéciaux et chiffres ne sont pas autorisés."
    );

    cy.get('[data-testid="inputFirstname"]').clear().type("John");

    cy.wait(1000);
    cy.get('[data-testid="errorFirstname"]').should("not.be.visible");
  });

  it("prevents multiple submissions", () => {
    cy.get('[data-testid="inputFirstname"]').type("John");
    cy.get('[data-testid="inputLastname"]').type("Doe");
    cy.get('[data-testid="inputEmail"]').type("John.doe@example.com");
    cy.get('[data-testid="inputDate"]').type("1990-01-01");
    cy.get('[data-testid="inputCity"]').type("Cannes");
    cy.get('[data-testid="inputZip"]').type("06400");
    cy.intercept("POST", "/users", {
      statusCode: 201,
      body: { message: "Inscription réussie !" },
    }).as("formSubmission");

    // Click the save button and ensure it's only clicked once
    cy.get('[data-testid="saveButton"]').click({ multiple: true });

    cy.wait("@formSubmission");

    cy.get("@formSubmission.all").should("have.length", 1);
    cy.get(".Toastify__toast-body").should("contain", "Inscription réussie !");
  });

  it("does not allow submission if the user is under 18", () => {
    cy.get('[data-testid="inputFirstname"]').type("Jane");
    cy.get('[data-testid="inputLastname"]').type("Doe");
    cy.get('[data-testid="inputEmail"]').type("jane.doe@gmail.com");
    cy.get('[data-testid="inputDate"]').type("2010-01-01"); // Under 18
    cy.get('[data-testid="inputCity"]').type("Nantes");
    cy.get('[data-testid="inputZip"]').type("44000");

    cy.get('[data-testid="saveButton"]').click();

    cy.get(".Toastify__toast-body", { timeout: 10000 }).should(
      "contain",
      "Vous devez être majeur pour vous inscrire."
    );
  });

  it("submits the form successfully when all conditions are met", () => {
    cy.get('[data-testid="inputFirstname"]').type("John");
    cy.get('[data-testid="inputLastname"]').type("Doe");
    cy.get('[data-testid="inputEmail"]').type("john.doe@gmail.com");
    cy.get('[data-testid="inputDate"]').type("1990-01-01");
    cy.get('[data-testid="inputCity"]').type("Biot");
    cy.get('[data-testid="inputZip"]').type("06410");

    cy.intercept("POST", "/users", {
      statusCode: 201,
      body: { message: "Inscription réussie !" },
    }).as("formSubmission");
    cy.get('[data-testid="saveButton"]').click();

    cy.wait("@formSubmission");
    cy.get(".Toastify__toast-body", { timeout: 10000 }).should(
      "contain",
      "Inscription réussie !"
    );
  });
  it("displays correctly in mobile view", () => {
    cy.viewport("iphone-6");
    cy.get(".user-item").should("be.visible");
    cy.get("button").contains("Sauvegarder").should("be.visible");
  });

});
