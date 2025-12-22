import {Queue} from "bullmq";
import Redis from "ioredis";

const connection = new Redis({
  username: "default",
  password: "*******",
  socket: {
    host: "redis-13271.crce263.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 6379,
  },
});

export const messageQueue = new Queue("message-persist", {
    connection,
})