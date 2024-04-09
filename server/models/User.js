const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing whitespaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Convert email to lowercase for case-insensitive matching
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
