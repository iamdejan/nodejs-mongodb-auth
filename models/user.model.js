const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = mongoose.Schema({
    email: {type: String, required: true, max: 255},
    password: {type: String, required: true},
});

const signOptions = {
    algorithm:  "HS512",
    expiresIn:  "1h"
};

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const token = jwt.sign({_id: user.id}, process.env.SECRET_KEY, signOptions);
    return token;
};

module.exports = mongoose.model("User", UserSchema);
