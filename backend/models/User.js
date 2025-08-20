// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  avatarUrl: {
    type: String, // Optional profile picture
    default: '',
  },

  tripsOwned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TripModel',
    }
  ],

  tripsJoined: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TripModel',
    }
  ],

  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model('User', userSchema);
export default User;
