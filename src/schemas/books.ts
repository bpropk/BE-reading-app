import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  subject: String,

  illustration: String,
  epub: String,

  star: Number,
  numberReview: Number,
  price: Number,
});

const Book = mongoose.model("book", BookSchema);
BookSchema.index({});

module.exports = {
  Book,
};

export {};
