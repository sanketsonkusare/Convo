import express from "express";
import authroutes from "./routes/authroute.js";
import {connectDB} from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authroutes);

app.listen(PORT, () => {
    console.log("Server is running on port:"+ PORT);
    connectDB()
})