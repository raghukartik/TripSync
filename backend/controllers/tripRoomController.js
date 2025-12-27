import { tryCatch } from "bullmq";
import Message from "../models/TripRooms.js";
import TripModel from "../models/Trips.js";
import { redis } from "../utils/redis.js";
import mongoose from "mongoose";

const getTripRoomMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { tripId } = req.params;
    // const { cursor, limit = 30 } = req.query;

    if (!tripId) {
      res.status(400).json({
        message: "TripId is required",
      });
    }

    const messages = await Message.find({ tripId }).populate({
      path: "sender",
      select: "name email"
    });

    return res.status(200).json({
      source: "database",
      messages,
    });

    // const redisKey = `trip:${tripId}:messages`;
    // if (!cursor) {
    //     const cachedMessages = await redis.lrange(redisKey, -limit, -1);
    //     console.log('Redis cached messages count:', cachedMessages.length);

    //     if (cachedMessages.length > 0) {
    //         return res.status(200).json({
    //         source: "redis",
    //         messages: cachedMessages.map(JSON.parse),
    //     });
    //   }
    // }

    // const tripObjectId = new mongoose.Types.ObjectId(tripId);
    // const query = { tripId: tripObjectId };

    // console.log('Database query before cursor:', query);
    // if (cursor) {
    //   query.createdAt = { $lt: new Date(cursor) };
    //   console.log('Database query after cursor:', query);
    // }
    // console.log('Final query:', JSON.stringify(query, null, 2));

    // const messages = await Message.find({ query })
    //   .sort({ createdAt: -1 })
    //   .limit(Number(limit))
    //   .lean();

    // console.log(messages);

    // return res.status(200).json({
    //   source: "database",
    //   messages,
    // });
  } catch (err) {
    console.error("getTripRoomMessages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

const tripRoomController = {
  getTripRoomMessage,
};

export default tripRoomController;
