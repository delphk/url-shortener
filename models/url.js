const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema(
  {
    originalUrl: String,
    newUrl: String
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
