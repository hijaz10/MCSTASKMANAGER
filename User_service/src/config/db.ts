import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI || "mongodb://mongo:27017/users")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: unknown) => console.error(`mongoDB connection faiure: ${err}`));
