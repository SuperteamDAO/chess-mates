import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.connect().then(() => {
  console.log("[⚡] Connected to Redis");
});

export const addKeyToRedis = async (user: string) => {
  await redis.set(user, Date.now());
};

export const RATELIMIT = 3 * 24 * 60 * 60 * 1000; // 3 days

export const canRunCommand = async (user: string) => {
  const lastUsed = await redis.get(user);
  if (!lastUsed) {
    return true;
  }
  const currentTime = Date.now();
  const difference = currentTime - parseInt(lastUsed);

  if (difference >= RATELIMIT) {
    return true;
  } else {
    return false;
  }
};
