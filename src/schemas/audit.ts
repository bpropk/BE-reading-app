import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
    },
    lastRead: String,
  },
  { timestamps: true }
);

const Audit = mongoose.model("audit", AuditSchema);
AuditSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = {
  Audit,
};

export {};
