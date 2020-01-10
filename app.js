require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");

const user = require("./routes/user.route");
const app = express();

const mongoose = require("mongoose");
let URL = process.env.DB_URL || "mongodb://localhost:27017/users";
mongoose.set('useCreateIndex', true);
mongoose.connect(URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", () => {
    console.error("Failed to connect to MongoDB!");
});
db.on("open", () => {
    console.log("MongoDB connected");
});

//TODO: add auth middleware later
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/user", user);

let port = process.env.PORT || 1234;
app.listen(port, () => {
    console.log('Server is up and running on port number', port);
});
