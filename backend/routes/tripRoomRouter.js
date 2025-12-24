import express from "express";
import authController from "../controllers/authController.js";
import tripRoomController from "../controllers/tripRoomController.js";


const router = express.Router();

router.route("/tripRooms/:tripId/messages").get(authController.protect, tripRoomController.getTripRoomMessage);

export default router;