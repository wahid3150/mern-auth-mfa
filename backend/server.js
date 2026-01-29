import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";

const app = express();
connectDB();

//middleware
app.use(express.json());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
