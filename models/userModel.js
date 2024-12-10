const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: { type: Number },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    first_name: { type: String },
    last_name: { type: String },
    phone_number: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    role: { type: String, enum: ["customer", "admin", "vendor"] },
    status: { type: String, enum: ["active", "inactive", "banned"] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    address: {
      street: { type: String },
      city: { type: String },
      postal_code: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true, collection: "Users" }
);

module.exports = mongoose.model("Users", userSchema);
