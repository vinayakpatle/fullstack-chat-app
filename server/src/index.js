import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {app,server} from "./lib/socket.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import path from "path";

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true // it means it allow this above link send req, and along with headers and cookies
}));

dotenv.config(); // this need to be called
const __dirname=path.resolve();

app.use(express.json({limit:"100mb"}));
app.use(express.urlencoded({limit:"100mb",extended:true}));
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/messages",messageRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../fronted/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../fronted", "dist", "index.html"));
    });
  }

const PORT=process.env.PORT;

server.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING ON POST: ${PORT}`);
})