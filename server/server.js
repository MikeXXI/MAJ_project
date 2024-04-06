const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(
    `mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_DATABASE}`
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
