const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
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
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/users", async (req, res) => {
  try {
    const { firstname, lastname, email, dateBirth, postalCode, city } =
      req.body;
    const user = new User({
      firstname,
      lastname,
      email,
      dateBirth,
      postalCode,
      city,
    });
    await user.save();
    res.status(200).json({ user, success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const serverPassword = await bcrypt.hash(
      `${process.env.SERVER_PASSWORD}`,
      10
    );
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      serverPassword
    );

    if (isPasswordCorrect) {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) throw new Error("User not found");
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Wrong password" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;
