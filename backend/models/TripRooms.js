import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const messageSchema = new Schema({
  tripId: {type: Types.ObjectId, ref: "TripModel", required: true},
  sender: { type: Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});


export default model("Message", messageSchema);
