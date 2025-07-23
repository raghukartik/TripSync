const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


// router.route('/').get(userController.getAllUsers);
router.route("/invitations/:tripId/respond").post(authController.protect, userController.respondToInvite);
router.route("/user/upcoming-trips").get(authController.protect, userController.upComingTrips);
router.route('/user/completed-trips').get(authController.protect, userController.completedTrips);
// router.route('/my-bookmark').get(authController.protect, userController.getUserBookmark);
// router.route('/add-to-bookmark').post(authController.protect, userController.addToBookmark);
// router.route('/remove-bookmark').delete(authController.protect, userController.removeBookmark);
// router.route('/delete-trip/:id').delete(authController.protect, userController.deleteTrip);
// router.route('/update-is-favourite/:id').put(authController.protect, userController.updateFav);

module.exports = router;