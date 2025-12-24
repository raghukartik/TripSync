import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); 

import { Worker } from "bullmq";
import mongoose from "mongoose";
import Message from "../models/TripRooms.js";
import { connectDB } from "../utils/db.js";
import { redis } from "../utils/redis.js";

await connectDB();

console.log("worker started");

new Worker(
  "message-persist",
  async (job) => {
    const { tripId } = job.data;   

    console.log("Processing trip:", tripId);

    const redisKey = `trip:${tripId}:messages`;

    const lua = `
      local msgs = redis.call("LRANGE", KEYS[1], 0, -1)
      redis.call("DEL", KEYS[1])
      return msgs
    `;

    const messages = await redis.eval(lua, 1, redisKey);

    if (!messages.length) return;

    const docs = messages.map((m) => {
      const parsed = JSON.parse(m);
      console.log(parsed);
      return {
        tripId,
        sender: parsed.sender,
        text: parsed.text,
        timeStamp: new Date(parsed.timeStamp),
      };
    });

    await Message.insertMany(docs);
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

console.log("worker done the job");
