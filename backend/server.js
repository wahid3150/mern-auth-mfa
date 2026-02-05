import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import { createClient } from "redis";

import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
connectDB();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.log("Missing redis url");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});
redisClient
  .connect()
  .then(() => console.log("Connected to redis"))
  .catch(console.error);

//middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
