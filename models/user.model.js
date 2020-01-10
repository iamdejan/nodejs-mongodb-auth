const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = mongoose.Schema({
    email: {type: String, required: true, max: 255},
    password: {type: String, required: true},
});

const signOptions = {
    expiresIn:  "12h"
};

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    // console.log(process.env.SECRET_KEY);
    const token = jwt.sign({_id: user.id}, process.env.SECRET_KEY, signOptions);
    // console.log("Token:", token);
    return token;
};

module.exports = mongoose.model("User", UserSchema);
