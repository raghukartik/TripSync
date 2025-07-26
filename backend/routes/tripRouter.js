const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../utils/multer");
const tripController = require("../controllers/tripController");

router
  .route("/trips")
  .get(authController.protect, tripController.getAllUserTrips)
  .post(authController.protect, tripController.createTrip);

router
  .route("/trips/:tripId")
  .get(authController.protect, tripController.getTrip)
  .delete(authController.protect, tripController.deleteTrip);

router
  .route("/trips/:tripId/add-collaborators")
  .put(authController.protect, tripController.addCollaborators);

router
  .route("/trips/:tripId/collaborators/:collaboratorId")
  .delete(authController.protect, tripController.deleteCollaborators);

router
  .route("/trips/:tripId/itinerary")
  .get(authController.protect, tripController.getTripItinerary)
  .post(authController.protect, tripController.addItinerary);

router
  .route("/trips/:tripId/itinerary/:itineraryId")
  .put(authController.protect, tripController.editItinerary);

router.route("/trips/:tripId/itinerary/:itineraryId/activities");

router
  .route("/trips/:tripId/itinerary/:itineraryId/activities/:activityId")
  .get(authController.protect, tripController.getItineraryActivity)
  .put(authController.protect, tripController.editItineraryActivity);

router
  .route("/trips/:tripId/tasks")
  .get(authController.protect, tripController.getTripTasks)
  .post(authController.protect, tripController.addTask);

router
  .route("/trips/:tripId/tasks/:taskId")
  .put(authController.protect, tripController.editTask)
  .delete(authController.protect, tripController.deleteTask);

router
  .route("/trips/:tripId/expenses")
  .get(authController.protect, tripController.getTripExpenses)
  .post(authController.protect, tripController.addExpenses);

router
  .route("/trips/:tripId/expenses/:expenseId")
  .put(authController.protect, tripController.editExpenses);

router
  .route("/trips/:tripId/invite")
  .post(authController.protect, tripController.inviteCollaborator);
module.exports = router;
