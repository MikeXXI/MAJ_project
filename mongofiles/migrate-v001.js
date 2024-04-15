const db = db.getSiblingDB("mydatabase");
db.users.insertOne({
  firstname: "Clara",
  lastname: "Martin",
  email: "clara.martin@example.com",
  dateBirth: "1990-01-01",
  postalCode: "75001",
  city: "Paris",
});
