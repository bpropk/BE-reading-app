import mongoose from "mongoose";
const { Schema } = mongoose;

const AuditSchema = new mongoose.Schema(
  {
    type: String,
    status: String,
    recievedAccount: String,
    account: { type: Schema.Types.ObjectId, ref: "users" },
    transferMoney: String,
    message: String,
    telecomTransaction: String,
    telecomAccount: String,
    telecomPrice: Number,
    card: { type: Schema.Types.ObjectId, ref: "cards" },
  },
  { timestamps: true }
);

const Audit = mongoose.model("audit", AuditSchema);

module.exports = {
  Audit,
};

export {};
