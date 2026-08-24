import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/admin.routes.js";
import carRoutes from "./routes/car.routes.js"

import { auditMiddleware } from "./middleware/auditMiddleware.js";

dotenv.config();

const app = express();

app.use(cookieParser());

// const allowedOrigins = [
//     "http://localhost:5173",
//     "http://192.168.68.59:5173",
// ];

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
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

// Middleware
app.use(auditMiddleware);

// routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/car", carRoutes)