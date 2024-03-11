import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
    },
    lock: {
      lockCount: { type: Number },
      lockWrongPassword: { type: Number },
      date: { type: Date },
    },
    role: Number,
    changePassword: Boolean,
    currentbudget: Number,
    phoneOtp: String,
  },
  { timestamps: true }
);
const User = mongoose.model("user", UserSchema);
UserSchema.index({ email: 1, phone: 1 }, { unique: true });

module.exports = {
  User,
};

export {};
