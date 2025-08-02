const express = require("express");
const TripModel = require("../models/Trips");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const User = require("../models/User");

// get all the stories

exports.getAllUserTrips = async (req, res, next) => {
  const start = new Date("2025-08-01");
  const end = new Date("2025-08-10");
  try {
    const { userId } = req.user;
    const trips = await TripModel.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).sort({ createdAt: -1 });

    if (!trips) {
      res.status(200).json({
        message: "No trips available",
      });
    }
    res.status(200).json({
      status: "success",
      results: trips.length,
      data: trips,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { userId: ownerId } = req.user;

    // Create trip
    const trip = await TripModel.create({
      title,
      description,
      owner: ownerId,
    });

    // Add trip to user's tripsOwned
    const user = await User.findById(ownerId);
    user.tripsOwned.push(trip._id);
    await user.save();

    res.status(200).json({
      status: "success",
      data: trip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create trip",
      error: error.message,
    });
  }
};

exports.getTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    if (!tripId) {
      return res.status(200).json({
        message: "Trip Id required",
      });
    }
    const trip = await TripModel.findById({ _id: tripId });
    res.status(200).json({
      status: "success",
      data: trip,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    if (!tripId) {
      return res.status(200).json({
        message: "Trip Id required",
      });
    }
    const trip = await TripModel.findByIdAndDelete({ _id: tripId });
    if (!trip) {
      return res.status(200).json({
        message: "Trip not found",
      });
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

exports.getTripCollaborators = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;

    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required" });
    }

    // Find the trip and verify access
    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    }).populate({
      path: "collaborators",
      select: "name email", // Fetch only name and email
    });

    if (!trip) {
      return res.status(403).json({
        message: "Trip not found or access denied.",
      });
    }

    // Return collaborator details
    return res.status(200).json({
      message: "Collaborators fetched successfully",
      collaborators: trip.collaborators, 
    });

  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.addCollaborators = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;
    const { collaborators } = req.body;

    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required" });
    }

    if (!Array.isArray(collaborators)) {
      return res
        .status(400)
        .json({ message: "Collaborators must be an array" });
    }

    const trip = await TripModel.findOne({ _id: tripId, owner: userId });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or not owned by you" });
    }

    for (const collab of collaborators) {
      const idToAdd = collab.userId;

      // Skip if already added or equals owner
      if (!trip.collaborators.includes(idToAdd) && idToAdd !== String(userId)) {
        trip.collaborators.push(idToAdd);
      }
    }

    await trip.save();

    res.status(200).json({
      status: "success",
      message: "Collaborators added",
      collaborators: trip.collaborators,
    });
  } catch (error) {
    console.error("Add Collaborators Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteCollaborators = async (req, res, next) => {
  try {
    const { tripId, collaboratorId } = req.params;
    const { userId: ownerId } = req.user;

    if (!tripId || !collaboratorId) {
      return res.status(400).json({
        message: "Trip ID and collaborator ID are required",
      });
    }

    const trip = await TripModel.findOne({ _id: tripId, owner: ownerId });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found or access denied",
      });
    }

    // Check if the collaborator exists in the list
    const index = trip.collaborators.indexOf(collaboratorId);
    if (index === -1) {
      return res.status(404).json({
        message: "Collaborator not found in this trip",
      });
    }

    // Remove collaborator
    trip.collaborators.splice(index, 1);
    await trip.save();

    res.status(200).json({
      status: "success",
      message: "Collaborator removed successfully",
      collaborators: trip.collaborators,
    });
  } catch (error) {
    console.error("Remove Collaborator Error:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getTripItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;

    if (!tripId) {
      return res.status(400).json({
        message: "Trip ID is required",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res.status(400).json({
        message: "Trip not found or denied access.",
      });
    }

    if (trip.itinerary.length > 0) {
      res.status(200).json({
        status: "success",
        results: trip.itinerary.length,
        data: trip.itinerary,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No itinerary added for this trip.",
      });
    }
  } catch (error) {
    console.error("Getting itinerary Error:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.addItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;
    const { date, activities } = req.body;

    if (!date || !Array.isArray(activities)) {
      return res.status(400).json({
        message: "Date and activities array are required",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    // Check if itinerary for the date already exists
    const existingDay = trip.itinerary.find((item) => item.date === date);

    if (existingDay) {
      // Add new activities to existing date
      for (const activity of activities) {
        existingDay.activities.push({
          activityId: new mongoose.Types.ObjectId().toString(),
          ...activity,
        });
      }
    } else {
      // Add a new date with activities
      trip.itinerary.push({
        date,
        activities: activities.map((act) => ({
          activityId: new mongoose.Types.ObjectId().toString(),
          ...act,
        })),
      });
    }

    await trip.save();

    res.status(200).json({
      status: "success",
      message: "Itinerary updated",
      itinerary: trip.itinerary,
    });
  } catch (error) {
    console.error("Add Itinerary Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.editItinerary = async (req, res, next) => {
  try {
    const { tripId, itineraryId } = req.params;
    const { userId } = req.user;
    const { date, activities } = req.body;

    if (!tripId || !itineraryId) {
      return res.status(400).json({
        message: "Trip ID and itinerary ID are required",
      });
    }

    if (activities && !Array.isArray(activities)) {
      return res.status(400).json({
        message: "Activities should be an array if provided",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found or access denied",
      });
    }

    // Find the itinerary item by its _id
    const itinerary = trip.itinerary.id(itineraryId);

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary entry not found",
      });
    }

    // Update fields only if provided
    if (date !== undefined) itinerary.date = date;
    if (activities !== undefined) itinerary.activities = activities;

    await trip.save();

    return res.status(200).json({
      message: "Itinerary updated successfully",
      updatedItinerary: itinerary,
    });
  } catch (error) {
    console.error("Edit Itinerary Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getItineraryActivity = async (req, res, next) => {
  try {
    const { tripId, itineraryId, activityId } = req.params;
    const { userId } = req.user;

    // Validate params
    if (!tripId || !itineraryId || !activityId) {
      return res.status(400).json({
        message: "Trip ID, itinerary ID, and activity ID are required",
      });
    }

    // Find the trip for this user or collaborator
    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    // Find the itinerary

    const itinerary = trip.itinerary.find(
      (i) => i._id.toString() === itineraryId
    );
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    // Find the activity

    const activity = itinerary.activities.find(
      (a) => String(a.activityId).trim() === String(activityId).trim()
    );
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Return the activity
    return res.status(200).json({
      message: "Activity fetched successfully",
      activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addItineraryActivity = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { tripId, itineraryId } = req.params;
    const { time, title, location, notes } = req.body;

    // Validate inputs
    if (!tripId || !itineraryId) {
      return res
        .status(400)
        .json({ message: "Trip ID and itinerary ID are required" });
    }
    if (!time || !title) {
      return res
        .status(400)
        .json({ message: "Time and title are required for an activity" });
    }

    // Find the trip and ensure the user owns it
    const trip = await Trip.findOne({ _id: tripId, userId });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    // Find the itinerary within the trip
    const itinerary = trip.itineraries.find(
      (i) => i.itineraryId === itineraryId
    );
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Create new activity object
    const newActivity = {
      time,
      title,
      location: location || "",
      notes: notes || "",
    };

    // Push new activity into itinerary
    itinerary.activities.push(newActivity);

    // Save trip
    await trip.save();

    return res.status(201).json({
      message: "Activity added successfully",
      activity: newActivity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editItineraryActivity = async (req, res, next) => {
  try {
    const { tripId, itineraryId, activityId } = req.params;
    const { userId } = req.user;
    const { time, title, location, notes } = req.body;

    if (!tripId || !itineraryId || !activityId) {
      return res.status(400).json({
        message: "Trip ID, itinerary ID, and activity ID are required",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found or access denied",
      });
    }

    // Find the specific itinerary day
    const itinerary = trip.itinerary.id(itineraryId);
    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    // Find the specific activity by its _id
    const activity = itinerary.activities.find(
      (a) => String(a.activityId).trim() === String(activityId).trim()
    );
    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // Update the activity fields if provided
    if (time !== undefined) activity.time = time;
    if (title !== undefined) activity.title = title;
    if (location !== undefined) activity.location = location;
    if (notes !== undefined) activity.notes = notes;

    await trip.save();

    return res.status(200).json({
      message: "Activity updated successfully",
      updatedActivity: activity,
    });
  } catch (error) {
    console.error("Edit Activity Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteItineraryActivity = async (req, res, next) => {
  try {
    const { tripId, itineraryId, activityId } = req.params;
    const { userId } = req.user;

    if (!tripId || !itineraryId || !activityId) {
      return res.status(400).json({
        message: "Trip ID, itinerary ID, and activity ID are required",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found or access denied",
      });
    }

    // Find the specific itinerary day
    const itinerary = trip.itinerary.id(itineraryId);
    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary day not found",
      });
    }

    const activity = itinerary.activities.find(
      (a) => String(a.activityId).trim() === String(activityId).trim()
    );
    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    activity.deleteOne();

    await trip.save();

    return res.status(200).json({
      message: "Activity deleted successfully",
      itinerary,
    });
  } catch (error) {
    console.error("Error deleting itinerary activity:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getTripTasks = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;

    if (!tripId) {
      return res.status(400).json({
        message: "Trip ID is required",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res.status(400).json({
        message: "Trip not found or denied access.",
      });
    }

    if (trip.tasks.length > 0) {
      res.status(200).json({
        status: "success",
        results: trip.tasks.length,
        data: trip.tasks,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No tasks added for this trip.",
      });
    }
  } catch (error) {
    console.error("Getting Task Error:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.addTask = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;
    const { text, assignedTo, completed } = req.body;

    if (!tripId || !assignedTo || typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Trip ID, assignedTo, and completed (boolean) are required",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found or you don't have access",
      });
    }

    const newTask = {
      taskId: new mongoose.Types.ObjectId().toString(),
      text: text || "",
      assignedTo,
      completed,
    };

    trip.tasks.push(newTask);
    await trip.save();

    res.status(201).json({
      status: "success",
      message: "Task added",
      task: newTask,
    });
  } catch (error) {
    console.error("Adding Task Error:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.editTask = async (req, res, next) => {
  try {
    const { tripId, taskId } = req.params;
    const { userId } = req.user;
    const { text, assignedTo, completed } = req.body;

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const task = trip.tasks.find((t) => t.taskId === taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update allowed fields
    if (text !== undefined) task.text = text;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (completed !== undefined) task.completed = completed;

    await trip.save();

    res.status(200).json({
      status: "success",
      message: "Task updated",
      task,
    });
  } catch (error) {
    console.error("Edit Task Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { tripId, taskId } = req.params;
    const { userId } = req.user;

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const initialLength = trip.tasks.length;
    trip.tasks = trip.tasks.filter((t) => t.taskId !== taskId);

    if (trip.tasks.length === initialLength) {
      return res.status(404).json({ message: "Task not found" });
    }

    await trip.save();

    res.status(200).json({
      status: "success",
      message: "Task deleted",
    });
  } catch (error) {
    console.error("Delete Task Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getTripExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;

    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required" });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    }).populate([
      {
        path: "expenses.spentBy",
        model: "User",
        select: "name email",
      },
      {
        path: "expenses.sharedWith",
        model: "User",
        select: "name email",
      },
    ]);

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or denied access." });
    }

    if (trip.expenses.length > 0) {
      return res.status(200).json({
        status: "success",
        results: trip.expenses.length,
        data: trip.expenses,
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "No expenses added for this trip.",
      });
    }
  } catch (error) {
    console.error("Get Expense Error:", error.message);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.addExpenses = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.user;
    const { amount, category, spentBy, sharedWith, note, date } = req.body;
    if (!tripId) {
      return res.status(400).json({
        message: "Trip ID is required.",
      });
    }

    if (
      typeof amount !== "number" ||
      !category ||
      !spentBy ||
      !note ||
      !date ||
      !sharedWith
    ) {
      return res.status(400).json({
        message:
          "All fields (amount, category, spentBy, note, date, sharedWith) are required.",
      });
    }

    if (!Array.isArray(sharedWith)) {
      return res.status(400).json({
        message: "sharedWith must be a non-empty array of user IDs.",
      });
    }

    const trip = await TripModel.findOne({
      _id: tripId,
      $or: [{ owner: userId }, { collaborators: userId }],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const newExpense = {
      amount: amount,
      category: category,
      spentBy: spentBy,
      sharedWith: sharedWith || null,
      note: note,
      date: date,
    };

    trip.expenses.push(newExpense);
    await trip.save();

    res.status(200).json({
      status: "success",
      data: newExpense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.editExpenses = async (req, res, next) => {
  try {
    const { tripId, expenseId } = req.params;
    const { userId } = req.user;
    const { amount, category, spentBy, sharedWith, note, date } = req.body;

    if (!tripId || !expenseId) {
      return res.status(400).json({
        message: "TripId or expenseId is required.",
      });
    }

    const trip = await TripModel.findOne({ _id: tripId, owner: userId });

    if (!trip) {
      return res.status(403).json({
        message: "Trip not found or access denied.",
      });
    }

    const expense = trip.expenses.find((e) => e._id.toString() === expenseId);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found.",
      });
    }

    // Update fields if provided
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (spentBy !== undefined) expense.spentBy = spentBy;
    if (sharedWith !== undefined) expense.sharedWith = sharedWith;
    if (note !== undefined) expense.note = note;
    if (date !== undefined) expense.date = date;

    await trip.save();

    return res.status(200).json({
      message: "Expense updated successfully.",
      updatedExpense: expense,
    });
  } catch (error) {
    console.error("Edit expense error:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

exports.inviteCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.user; // authenticated user (owner)
    const { tripId } = req.params;
    const { collabId } = req.body;

    if (!tripId || !collabId) {
      return res.status(400).json({
        message: "TripId or collabId is required.",
      });
    }

    const trip = await TripModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found.",
      });
    }

    if (trip.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the trip owner can invite collaborators.",
      });
    }

    const isAlreadyCollaborator = trip.collaborators.some(
      (id) => id.toString() === collabId
    );
    if (isAlreadyCollaborator) {
      return res.status(400).json({
        message: "User is already a collaborator.",
      });
    }

    const isAlreadyInvited = trip.pendingInvites?.some(
      (inv) => inv.user.toString() === collabId
    );
    if (isAlreadyInvited) {
      return res.status(400).json({
        message: "User has already been invited.",
      });
    }

    // Add to pendingInvites
    trip.pendingInvites = trip.pendingInvites || [];
    trip.pendingInvites.push({
      user: collabId,
      invitedAt: new Date(),
      status: "pending",
    });

    await trip.save();

    // Create notification
    const recipient = await User.findById(collabId);
    if (!recipient) {
      return res.status(404).json({ message: "Collaborator user not found." });
    }

    const notification = new Notification({
      recipient: recipient._id,
      sender: userId,
      trip: trip._id,
      type: "trip-invite",
      message: `You have been invited to join the trip "${trip.title}".`,
    });

    await notification.save();

    io.to(collabId).emit("notification", {
      type: "trip-invite",
      message: `You have been invited to join the trip "${trip.title}".`,
      tripId: trip._id,
    });

    return res.status(200).json({
      message: "Collaborator invited successfully.",
      notificationId: notification._id,
    });
  } catch (error) {
    console.error("inviteCollaborator error:", error);
    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};
