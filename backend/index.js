
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require("./config.json");
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { Server } = require('socket.io');
const http = require('http');
const path = require("path");
const User = require("./models/User");
const TripModel= require("./models/Trips");
const { authenticateToken } = require("./utilities");
const tripRouter = require("./routes/tripRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
mongoose.connect(config.connectionString);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies
  })
);
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const io = new Server(server, {
  cors: {
    origin: '*', // Use your frontend URL in production
    methods: ['GET', 'POST']
  }
});
global.io = io;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAuth_Client_ID,
      clientSecret: process.env.OAuth_Client_Secret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id }); // ✅ await added
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0]?.value,
            avatar: profile.photos[0]?.value,
          });
        }

        return done(null, user); // ✅ user now has _id
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// google routes

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // 🔐 set to true in production (with HTTPS)
      sameSite: "Lax",
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });

  // Join user room
  socket.on('joinUserRoom', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} joined user room user:${userId}`);
  });

  // Join trip chat room
  socket.on('joinTripRoom', (tripId) => {
    socket.join(`trip:${tripId}`);
    console.log(`Socket ${socket.id} joined trip room trip:${tripId}`);
  });

  // Send message to trip chat
  socket.on('sendMessage', async ({ tripId, sender, message }) => {
    try {
      const msgData = {
        sender,
        message,
        sentAt: new Date(),
      };

      // ✅ Save message in DB
      await TripModel.findByIdAndUpdate(tripId, {
        $push: { chatMessages: msgData }
      });

      // ✅ Optionally fetch sender's name (if you want to show it)
      const user = await User.findById(sender).select('name');
      msgData.senderName = user?.name || "Unknown";

      // ✅ Broadcast message
      io.to(`trip:${tripId}`).emit('newMessage', msgData);
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
    }
  });
});



app.use("/api", tripRouter);
app.use("/api", userRouter);
app.use('/api', authRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));


const PORT = 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

module.exports = server;
