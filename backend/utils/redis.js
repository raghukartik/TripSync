import Redis from "ioredis";

export const redis = new Redis({
  username: "default",
  password: "*******",
  maxRetriesPerRequest: null,
  socket: {
    host: "redis-13271.crce263.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 13271
  },
});
