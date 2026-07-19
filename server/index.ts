import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 7500;

// DB connection
try {
    mongoose.connect(process.env.MONGO_URI as string)
        .then(() => {
            console.log("MongoDB connected");
            app.listen(PORT, () => console.log(`Server running on ${PORT}`));
        })
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
}

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);