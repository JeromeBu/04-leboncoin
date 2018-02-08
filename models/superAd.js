const mongoose = require("mongoose");
const validations = require("../public/js/validations.js");

mongoose.connect("mongodb://localhost:27017/leboncoin");

const superAdSchema = mongoose.Schema(validations.superAd);

module.exports = mongoose.model("SuperAd", superAdSchema);
