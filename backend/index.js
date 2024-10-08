// type: module -> to use import in index.js
// CORS (Cross-Origin Resource Sharing) is a mechanism that allows or restricts web applications 
// running at one origin (domain) to make requests to a different origin.
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({});
const app=express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));
const PORT = 3000;
// const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on port ${PORT}`)
})