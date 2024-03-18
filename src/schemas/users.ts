import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    name: String,
    dateOfBirth: {
      type: Date,
    },
    address: String,
    username: String,
    password: String,
    status: String,
    lock: {
      lockCount: { type: Number },
      lockWrongPassword: { type: Number },
      date: { type: Date },
    },
    role: Number,
    changePassword: Boolean,
    currentbudget: Number,
    phoneOtp: String,
    library: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("user", UserSchema);
UserSchema.index({ email: 1, phone: 1 }, { unique: true });

module.exports = {
  User,
};

export {};
