import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import {createServer} from "http";
import http from "http";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from "./models/User.js";

// Fix for __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import TripModel from "./models/Trips.js";
import { authenticateToken } from "./utilities.js";
import tripRouter from "./routes/tripRouter.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const app = express();
const server = createServer(app);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(session({
  secret: "your-secret-key", // change to something secure
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true if using HTTPS
}))


app.use(express.urlencoded({ extended: true }));
// app.use(passport.initialize());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Use your frontend URL in production
    methods: ['GET', 'POST']
  }
});
global.io = io;

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.OAuth_Client_ID,
//       clientSecret: process.env.OAuth_Client_Secret,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id }); // ✅ await added
//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0]?.value,
//             avatar: profile.photos[0]?.value,
//           });
//         }

//         return done(null, user); // ✅ user now has _id
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// google routes

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false, failureRedirect: "/" }),
//   (req, res) => {
//     const token = jwt.sign(
//       { userId: req.user._id },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "72h" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // 🔐 set to true in production (with HTTPS)
//       sameSite: "Lax",
//       maxAge: 72 * 60 * 60 * 1000, // 72 hours
//     });

//     res.redirect(`${process.env.CLIENT_URL}/dashboard`);
//   }
// );

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

export default server;
