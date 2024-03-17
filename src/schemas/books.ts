import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: String,
  illustration: String,
  star: Number,
  numberReview: Number,
  price: Number,
  author: String,
});

const Book = mongoose.model("book", BookSchema);
BookSchema.index({});

module.exports = {
  Book,
};

export {};
