const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex_code: { type: String, required: true },
    images: [String],
    sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sizes" }],
  },
  { collection: "Colors" }
);

const Color = mongoose.model("Colors", ColorSchema);

module.exports = Color;
