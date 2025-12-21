import Redis from "ioredis";

const redis = new Redis({
  username: "default",
  password: "*******",
  socket: {
    host: "redis-13271.crce263.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 13271,
  },
});

redis.on("connect", ()=>{
  console.log("redis connected");
})

export const socketController = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");
    console.log("Id:", socket.id);

    // Emit a welcome message to the new socket
    socket.emit("welcome", { message: "Welcome to the TripSync" });

    // Handle message events
    socket.on("message", async(data) => {
      const {tripId, userId, message} = data;
    
      io.to(tripId).emit("recieve-msg", {
        message,
        userId, 
        tripId
      });
      const messagePayload = {
        tripId,
        sender: userId, 
        text: message,
        timeStamp: new Date()
      }
      const redisKey = `trip:${tripId}:messages`;
      await redis.rpush(redisKey, JSON.stringify(messagePayload));
      // Optional safety: auto-expire if never flushed
      await redis.expire(redisKey, 3600); // 1 hour
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
