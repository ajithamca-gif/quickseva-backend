import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import upload from "./middleware/uploadMiddleware.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import {fileURLToPath} from "url";
import { dirname, join } from "path";


dotenv.config();

const app = express();

const __filename= fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads", express.static(join(__dirname,"../uploads")));


//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);


//Test route:
app.get("/", (req,res)=>{
    res.send("QuickSeva API Running");
});

mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>{
        console.log(`server running on ${PORT}`);
    })
})
.catch(err=> console.log("MongoDB Error:", err));

