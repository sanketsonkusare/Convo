import express from "express";
import authroutes from "./routes/authroute.js";
import messageroutes from "./routes/messageroute.js";
import {connectDB} from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
dotenv.config();

const PORT = process.env.PORT;
app.use(express.json({limit:"8mb"}));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


app.use("/api/auth", authroutes);
app.use("/api/message", messageroutes);

server.listen(PORT, () => {
    console.log("Server is running on port:"+ PORT);
    connectDB()
})