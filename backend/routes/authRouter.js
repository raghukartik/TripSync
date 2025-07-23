const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route('/auth/create-account').post(authController.createAccount);
router.route('/auth/login').post(authController.login);
router.route('/auth/logout').post(authController.logout);

module.exports = router;