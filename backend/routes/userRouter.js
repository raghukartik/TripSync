import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();


// router.route('/').get(userController.getAllUsers);
router.route("/invitations/:tripId/respond").post(authController.protect, userController.respondToInvite);
router.route("/user/upcoming-trips").get(authController.protect, userController.upComingTrips);
router.route("/user/upcoming-trips-dashboard").get(authController.protect, userController.upComingTripsDashboard);
router.route('/user/completed-trips').get(authController.protect, userController.completedTrips);
router.route('/user/completed-trips-dashboard').get(authController.protect, userController.completedTripsDashboard);
router.route('/user/all-trips').get(authController.protect, userController.allUserTrips);
router.route('/user/me').get(authController.protect, authMiddleware, userController.getUserInfo);
// router.route('/my-bookmark').get(authController.protect, userController.getUserBookmark);
// router.route('/add-to-bookmark').post(authController.protect, userController.addToBookmark);
// router.route('/remove-bookmark').delete(authController.protect, userController.removeBookmark);
// router.route('/delete-trip/:id').delete(authController.protect, userController.deleteTrip);
// router.route('/update-is-favourite/:id').put(authController.protect, userController.updateFav);

export default router;