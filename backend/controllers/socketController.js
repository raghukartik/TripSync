import Redis from "ioredis";
import { messageQueue } from "../queues/messageQueue";
const redis = new Redis({
  username: "default",
  password: "*******",
  socket: {
    host: "redis-13271.crce263.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 6379,
  },
});

redis.on("connect", () => {
  console.log("redis connected");
});

export const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");
    console.log("Id:", socket.id);

    // Emit a welcome message to the new socket
    socket.emit("welcome", { message: "Welcome to the TripSync" });

    // Handle message events
    socket.on("message", async (data) => {
      const { tripId, userId, message } = data;

      io.to(tripId).emit("recieve-msg", {
        message,
        userId,
        tripId,
      });

      const redisKey = `trip:${tripId}:messages`;

      const payload = JSON.stringify({
        tripId,
        sender: userId,
        text: message,
        timeStamp: Date.now(),
      });
     

      await redis.rpush(redisKey, payload);

      const messages = await redis.lrange(redisKey, 0, -1);
      const parsed = messages.map(m => JSON.parse(m));

      console.log("msg from redis: ", parsed);

      const ttl = await redis.ttl(redisKey);
      if (ttl === -1) {
        await redis.expire(redisKey, 3600);
      }

      console.log(redis.options.host, redis.options.port, redis.options.db);

    });

    // Handle joining a room
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`${socket.id} joined room: ${room}`);
    });

    // Optional: Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
