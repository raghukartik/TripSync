import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";
router.route('/auth/create-account').post(authController.createAccount);
router.route('/auth/login').post(authController.login);
router.route('/auth/logout').post(authController.logout);

export default router;