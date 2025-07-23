const express = require("express");
const User = require("../models/User");
const TripModel = require("../models/Trips");
const Notification = require("../models/Notification");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userSchema.find({});
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.respondToInvite = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { tripId } = req.params;
    const { status } = req.body; // expected: 'accepted' or 'rejected'

    if (!tripId || !status) {
      return res.status(400).json({
        message: "Trip ID and status are required.",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'accepted' or 'rejected'.",
      });
    }

    const trip = await TripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    const invitationIndex = trip.pendingInvites.findIndex(
      (inv) => inv.user.toString() === userId.toString()
    );

    if (invitationIndex === -1) {
      return res.status(403).json({
        message: "You have not been invited to this trip.",
      });
    }

    const alreadyCollaborator = trip.collaborators.includes(userId);
    if (alreadyCollaborator && status === "accepted") {
      return res.status(400).json({
        message: "You are already a collaborator.",
      });
    }

    // Update invitation status
    trip.pendingInvites[invitationIndex].status = status;

    if (status === "accepted") {
      trip.collaborators.push(userId);
    }

    await trip.save();
    const user = await User.findOne({ _id: userId });
    user.tripsJoined.push(tripId);
    await user.save();

    // Update related notification
    await Notification.findOneAndUpdate(
      {
        trip: tripId,
        recipient: userId,
        type: "trip-invite",
      },
      {
        $set: { isAccepted: true },
      }
    );

    // Optional real-time event
    // io.to(trip.owner.toString()).emit("trip:inviteResponse", { userId, tripId, status });

    return res.status(200).json({
      message: `You have successfully ${status} the invitation.`,
      tripId: trip._id,
    });
  } catch (error) {
    console.error("respondToInvite error:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

exports.upComingTrips = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const upComingTrips = await TripModel.find({
      $and: [
        {
          $or: [{ owner: userId }, { collaborators: userId }],
        },
        {
          startDate: { $gte: new Date() },
        },
      ],
    }).populate("collaborators", "name email") // 👈 populates name & email

    if (!upComingTrips) {
      return res.status(400).json({
        message: "No upcoming trips found!",
      });
    }
    res.status(200).json({
      status: "success",
      results: upComingTrips.length,
      data: {
        upComingTrips,
      },
    });
  } catch (error) {
    console.error("upcoming error:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

exports.completedTrips = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const upComingTrips = await TripModel.find({
      $and: [
        {
          $or: [{ owner: userId }, { collaborators: userId }],
        },
        {
          endDate: { $lte: new Date() },
        },
      ],
    });

    if (!upComingTrips) {
      return res.status(400).json({
        message: "No upcoming trips found!",
      });
    }
    res.status(200).json({
      status: "success",
      results: upComingTrips.length,
      data: {
        upComingTrips,
      },
    });
  } catch (error) {
    console.error("upcoming error:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

/* exports.getUserTrips = async (req, res, next) => {
  try {
    const userTrip = await TripModel.find({ userId: req.user.userId });

    if (!userTrip) {
      return res.status(200).json({
        message: "You have no tales",
      });
    }

    res.status(200).json({
      status: "success",
      data: userTrip,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.addToBookmark = async (req, res, next) => {
  try {
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ message: "tripId is required." });
    }

    const user = await userSchema.findOne({ _id: req.user.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.bookmark.includes(tripId)) {
      return res.status(200).json({ message: "Trip already bookmarked." });
    }

    user.bookmark.push(tripId);
    await user.save();

    res.status(200).json({
      message: "Trip added to bookmarks successfully.",
      bookmark: user.bookmark,
    });
  } catch (error) {
    console.error("Error adding to bookmark:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.removeBookmark = async (req, res, next) => {
  try {
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ message: "tripId is required." });
    }

    const user = await userSchema.findOne({ _id: req.user.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure user.bookmark is an array
    if (!Array.isArray(user.bookmark)) {
      user.bookmark = [];
    }

    // Check if tripId exists in bookmark
    const tripIdStr = tripId.toString();
    const isBookmarked = user.bookmark.some(
      (id) => id.toString() === tripIdStr
    );

    if (!isBookmarked) {
      return res.status(200).json({ message: "Trip is not bookmarked." });
    }

    // Remove the tripId from bookmarks
    user.bookmark = user.bookmark.filter((id) => id.toString() !== tripIdStr);

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Bookmark removed successfully.",
      data: user.bookmark,
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

exports.getUserBookmark = async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ _id: req.user.userId });
    const bookmarks = user.bookmark;
    console.log(bookmarks);

    if (!bookmarks) {
      return res.status(200).json({
        message: "You have no bookmarks",
      });
    }
    res.status(200).json({
      status: "success",
      data: bookmarks,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    if (!id) {
      return res.status(400).json({ message: "TripId is required" });
    }

    const trip = await TripModel.findOneAndDelete({ _id: id, userId });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized" });
    }

    res.status(200).json({
      status: "success",
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};
 */
