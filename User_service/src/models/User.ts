import mongoose from "mongoose";
import { IUser } from "../types/user.types";

const User = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Users = mongoose.model<IUser>("Users", User);

export default Users;
