import express from "express";
import cort from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./Router/userRoute.js";
import chatRouter from "./Router/chatRouter.js"
import messageRouter from "./Router/messageRouter.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cort());
app.use("/api/users", userRoute);
app.use('/api/chats',chatRouter)
app.use('/api/message',messageRouter)
app.get("/", (req, res) => {
  res.send("Welcome our chat app API...");
});
const port =  5000;
app.listen(port, (req, res) => {
  console.log(`Sever running on pork: ${port}`);
});
mongoose
  .connect(process.env.ATLAS_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MogoDB connection established "))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));
