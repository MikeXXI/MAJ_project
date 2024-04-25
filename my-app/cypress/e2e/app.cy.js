describe("User Management Display", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("displays users correctly", () => {
    cy.get(".user-item").should("have.length.at.least", 1);
    cy.get(".user-item")
      .first()
      .should("contain", "Nom:")
      .and("contain", "Prénom:");
  });

  it("adds a new user correctly and verifies the user list", () => {
    const newUser = {
      firstname: "Aicha",
      lastname: "Hamida",
      email: "aicha.hamida@ynov.com",
      dateBirth: "1990-09-09",
      city: "Antibes",
      postalCode: "06600",
    };

    // Intercept the POST request for adding a new user
    cy.intercept("POST", "/users", {
      statusCode: 201,
      body: { id: "newUserId", ...newUser },
    }).as("addUser");

    Object.keys(newUser).forEach((field) => {
      cy.get(`input[name="${field}"]`).type(newUser[field]);
    });

    cy.get('[data-testid="saveButton"]').click();

    cy.wait("@addUser").then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      cy.get(".Toastify__toast-body").should(
        "contain",
        "Inscription réussie !"
      );
    });
  });

  it("handles API errors during user deletion gracefully", () => {
    cy.get(".user-item")
      .first()
      .invoke("attr", "data-id")
      .then((userId) => {
        cy.log("User ID obtained for deletion:", userId);
        cy.intercept("DELETE", `http://localhost:8000/users/**`, {
          statusCode: 500,
        }).as("deleteRequest");
        cy.get(".user-item")
          .first()
          .find("button")
          .contains("Supprimer")
          .click();
        cy.get(".user-item")
          .first()
          .find('input[type="password"]')
          .type("fakepassword");
        cy.get(".user-item")
          .first()
          .find("button")
          .contains("Confirmer")
          .click();
        cy.wait("@deleteRequest").its("response.statusCode").should("eq", 500);
      });
  });

  it("toggles delete options on click", () => {
    cy.get(".user-item").first().find("button").contains("Supprimer").click();
    cy.get(".user-item")
      .first()
      .find('input[type="password"]')
      .should("be.visible");
    cy.get(".user-item")
      .first()
      .find("button")
      .contains("Confirmer")
      .should("be.visible");
    cy.get(".user-item")
      .first()
      .find("button")
      .contains("Annuler")
      .should("be.visible");
  });

  it("successfully deletes a user with correct password", () => {
    const password = `${process.env.SERVER_PASSWORD}`;
    cy.get(".user-item").first().find("button").contains("Supprimer").click();
    cy.get(".user-item").first().find('input[type="password"]').type(password);
    cy.intercept("DELETE", "**/users/**", { statusCode: 204 }).as("deleteUser");
    cy.get(".user-item").first().find("button").contains("Confirmer").click();
    cy.wait("@deleteUser");
  });
  it("cancels the deletion process", () => {
    cy.get(".user-item").first().find("button").contains("Supprimer").click();
    cy.get(".user-item").first().find("button").contains("Annuler").click();
    cy.get(".user-item")
      .first()
      .find('input[type="password"]')
      .should("not.exist");
  });
  it("displays correctly in mobile view", () => {
    cy.viewport("iphone-6");
    cy.get(".user-item").should("be.visible");
    cy.get("button").contains("Sauvegarder").should("be.visible");
  });
});
