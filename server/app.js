const mongoose = require("mongoose");
const express = require("express");
//const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const app = express();
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_DATABASE}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth, postalCode, city } =
      req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      dateOfBirth,
      postalCode,
      city,
    });
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new Error("User not found");
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
