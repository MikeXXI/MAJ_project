const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const bcrypt = require("bcrypt");

describe("Test API routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("mongoose", () => {
      return {
        connect: jest.fn().mockImplementationOnce(() => Promise.resolve()),
      };
    });
  });
  describe("GET users", () => {
    it("should return a list of users", async () => {
      const mockUsers = [
        {
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.com",
          dateBirth: new Date("1995-07-15"),
          postalCode: "54321",
          city: "Springfield",
        },
        {
          firstname: "Jane",
          lastname: "Doe",
          email: "jane.doe@example.com",
          dateBirth: new Date("1990-01-01"),
          postalCode: "12345",
          city: "Anytown",
        },
      ];
      const findMock = jest.fn().mockResolvedValue(Promise.resolve(mockUsers));
      User.find = findMock;

      const response = await request(app).get("/users");

      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(mockUsers.length);

      expect(response.body[0].firstname).toBe(mockUsers[0].firstname);
      expect(response.body[0].email).toBe(mockUsers[0].email);
    });
  });

  describe("POST /users", () => {
    it("should add a new user", async () => {
      const newUser = {
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        dateBirth: "1990-01-01T00:00:00.000Z",
        postalCode: "12345",
        city: "Paris",
      };
      const saveMock = jest.fn().mockResolvedValue(newUser);
      User.prototype.save = saveMock;

      const response = await request(app).post("/users").send(newUser);

      expect(response.status).toBe(200);
      expect(response.body.user.firstname).toBe(newUser.firstname);
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.success).toBe(true);
    });
  });

  describe("DELETE /users", () => {
    it("should delete user", async () => {
      const inputPassword = "secret++";
      const userId = "123456";
      const user = {
        _id: userId,
        firstname: "Jane",
        lastname: "Doe",
        email: "jane@example.com",
        dateBirth: "1990-01-01T00:00:00.000Z",
        postalCode: "12345",
        city: "Paris",
      };

      jest.spyOn(bcrypt, "compare").mockResolvedValue(true); // Simuler la comparaison réussie

      const findByIdAndDeleteMock = jest.fn().mockResolvedValue(user);
      User.findByIdAndDelete = findByIdAndDeleteMock;

      const response = await request(app)
        .delete(`/users/${userId}`)
        .send({ password: inputPassword });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });
  });
});
