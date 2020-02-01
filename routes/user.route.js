const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/user.controller");

//testing route here
router.get("/test", user_controller.test);

//routes here
router.post("/register", user_controller.register);
router.post("/auth", user_controller.authenticate);
router.post("/validate", user_controller.validate);

module.exports = router;
