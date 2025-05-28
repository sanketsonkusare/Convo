import express from "express";
import authroutes from "./routes/authroute.js";
import messageroutes from "./routes/messageroute.js";
import {connectDB} from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


app.use("/api/auth", authroutes);
app.use("/api/message", messageroutes);

app.listen(PORT, () => {
    console.log("Server is running on port:"+ PORT);
    connectDB()
})