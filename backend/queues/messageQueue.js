import {Queue} from "bullmq";
import { redis } from "../utils/redis.js";


export const messageQueue = new Queue("message-persist", {
    redis,
})