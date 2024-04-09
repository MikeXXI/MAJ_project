const db = db.getSiblingDB("mydatabase");
db.users.insertOne({
  firstName: "Clara",
  lastName: "Martin",
  email: "clara.martin@example.com",
  dateOfBirth: "1990-01-01",
  postalCode: "75001",
  city: "Paris",
});
