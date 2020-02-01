const User = require("../models/user.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("email-validator");

exports.test = function(request, response, next) {
    response.set("Content-Type", "application/json");
    response.send({
        "message": "Hello world!"
    });
};

exports.register = function(request, response, next) {
    const email = request.body["email"];
    if(validator.validate(email) !== true) {
        response.sendStatus(406);
        return;
    }

    let user = new User({
        email: request.body["email"],
        password: bcrypt.hashSync(request.body["password"], 10),
    });

    user.save(function (error) {
        if(error) {
            return next(error);
        }
        response.set("Content-Type", "application/json");
        response.send(user);
    });
};

exports.authenticate = function(request, response, next) {
    const email = request.body["email"];
    if(email === null) {
        response.sendStatus(400);
        return;
    }

    if(validator.validate(email) !== true) {
        response.sendStatus(406);
        return;
    }

    User.findOne({email: email}, function (error, user) {
        if(error) {
            return next(error);
        }

        if(user == null) {
            response.sendStatus(404);
            return;
        }

        const password = request.body["password"];
        if(password == null) {
            response.sendStatus(400);
            return;
        }
        if(bcrypt.compareSync(password, user.password)) {
            response.set("Content-Type", "application/json");
            response.send({
                token: user.generateAuthToken()
            });
        } else {
            response.sendStatus(404);
        }
    });
};

exports.validate = function(request, response, next) {
    //validate token
    //if token is valid, then try to find user

    try {
        let token = request.headers["authorization"].split(' ')[1];
        if(token == null) {
            throw new Error("Token is not found");
        }

        let decodedToken = jwt.decode(token, process.env.SECRET_KEY);

        if(decodedToken == null) {
            throw new Error("Decoded token is null");
        }

        User.findOne({"_id": decodedToken["_id"]}, function (error, user) {
            if(error) {
                throw error;
            }

            if(user == null) {
                throw new Error("User is not found");
            }

            response.send(user);
        });
    } catch (e) {
        response.status(401).json({
            "error": e.toString()
        });
    }
};
