// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // system notifications may not have a sender
  },

  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TripModel',
    default: null,
  },

  type: {
    type: String,
    enum: [
      'trip-invite',
      'trip-edit',
      'chat-mention',
      'task-assigned',
      'expense-added',
      'story-edit',
      'custom'
    ],
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  isAccepted: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
