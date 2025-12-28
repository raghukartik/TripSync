// models/Invitation.js
import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    token: {
      type: String,
      required: true,
      unique: true
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"],
      default: "PENDING"
    },

    expiresAt: {
      type: Date,
      required: true
    },

    acceptedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

invitationSchema.index(
  { tripId: 1, email: 1 },
  { unique: true, partialFilterExpression: { status: "PENDING" } }
);

invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // MongoDb TTL index

const InvitationModel = mongoose.model("InvitationModel", invitationSchema);
export default InvitationModel;
