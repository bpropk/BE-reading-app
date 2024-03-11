import mongoose from "mongoose";

const CardSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    expiredDate: Date,
    secretCode: String,
    cash: Number,
  },
  { timestamps: true }
);

const Card = mongoose.model("card", CardSchema);

module.exports = {
  Card,
};

export {};
