import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
    },
    star: Number,
    review: String,
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("review", ReviewSchema);

module.exports = {
  Review,
};

export {};
