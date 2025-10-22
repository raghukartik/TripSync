import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const messageSchema = new Schema({
  sender: { type: Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const tripRoomSchema = new Schema(
  {
    tripId: { type: Types.ObjectId, ref: "Trips", required: true },
    collaborators: { type: [{ type: Types.ObjectId, ref: "User" }], default: [] },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true } 
);

export default model("TripRoom", tripRoomSchema);
