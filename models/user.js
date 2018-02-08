const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const validations = require("../public/js/validations.js");

const UserSchema = new mongoose.Schema(validations.user);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
