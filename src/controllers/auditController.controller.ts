import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";

const { User } = require("@schemas/users");
const { Audit } = require("@schemas/audit");
const { Book } = require("@schemas/books");

const auditModel = mongoose.model("audit", Audit.AuditSchema);

async function getUser(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const userId = decodedToken.id;
  const user = await User.findById({
    _id: userId,
  });
  return user;
}

async function generateAudit(req, res) {
  const { bookId, location } = req.body;

  try {
    const user = await getUser(req);
    const book = await Book.findById({
      _id: bookId,
    });

    await auditModel.findOneAndUpdate(
      {
        user,
        book,
      },
      {
        lastRead: location,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).send({
      message: "Create/Update Audit success",
    });
  } catch (err) {
    return res.status(400).send({
      err,
    });
  }
}

async function getAudit(req, res) {
  const bookId = req.params.bookId;
  try {
    const user = await getUser(req);

    const record = await Audit.findOne({
      user: user._id,
      book: bookId,
    });
    console.log(record);

    return res.status(200).send({
      location: record?.lastRead || null,
    });
  } catch (err) {
    return res.status(400).send({
      err,
    });
  }
}

module.exports = {
  generateAudit,
  getAudit,
};

export {};
