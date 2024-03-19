import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    unique: true,
    type: String,
  },
  author: String,
  description: String,
  subject: String,

  illustration: String,
  epub: String,

  price: Number,
});

const Book = mongoose.model("book", BookSchema);
BookSchema.index({ title: 1, author: 1 }, { unique: true });

module.exports = {
  Book,
};

export {};
