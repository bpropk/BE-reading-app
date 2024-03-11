import { json } from "body-parser";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

const { User } = require("@schemas/users");
const { Audit } = require("@schemas/audits");
const { Card } = require("@schemas/cards");
const { UserRole, UserStatus } = require("../utils/enum/user");
const { statusTransaction } = require("../utils/enum/audit");

async function listAccount(req: Request, res: Response) {
  const user = await User.find({
    role: UserRole.User,
  });
  return res.status(200).send(user);
}

async function detailAccount(req: Request, res: Response) {
  if (req.params.userId) {
    console.log(req.params.userId);
    try {
      const detail = await User.findById({
        _id: req.params.userId,
      });
      return res.status(200).send(detail);
    } catch (error) {
      return res.status(400).send({ message: "Bad Request" });
    }
  }
  return res.status(400).send({ message: "Bad Request" });
}

async function updateStatus(req: Request, res: Response) {
  const { userId, status } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json("Trạng thái không hợp lệ");
  }
  if (userId) {
    try {
      const detail = await User.findById({
        _id: userId,
      });
      detail.status = status;
      await detail.save();
      return res.status(200).send({ message: "Trạng thái đã thay đổi" });
    } catch (error) {
      return res.status(400).send({ message: "Bad Request" });
    }
  }
  return res.status(400).send({ message: "Bad Request" });
}

async function listTransaction(req: Request, res: Response) {
  const audits = await Audit.find({}).sort({ createdAt: -1 });
  return res.json(audits);
}

async function acceptTransaction(req: Request, res: Response) {
  const { transactionId } = req.params;
  try {
    const audit = await Audit.findOne({
      _id: transactionId,
      status: statusTransaction.depositPending,
    });
    if (audit) {
      const card = await Card.findOne({
        _id: audit.card,
      });
      console.log(card);
      const user = await User.findOne({
        _id: audit.account,
      });

      card.cash = Number(card.cash) + Number(audit.transferMoney);
      await card.save();
      user.currentbudget =
        Number(user.currentbudget) - Number(audit.transferMoney);
      await user.save();
      (audit.status = statusTransaction.accept), await audit.save();

      return res.status(200).send({ message: "Giao dịch đã được xét duyệt" });
    }
    return res.status(400).send("Mã giao dịch không hợp lệ");
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function declineTransaction(req: Request, res: Response) {
  const { transactionId } = req.params;
  try {
    const audit = await Audit.findOne({
      _id: transactionId,
      status: statusTransaction.depositPending,
    });
    if (audit) {
      audit.status = statusTransaction.decline;
      await audit.save();

      return res.status(200).send({ message: "Huỷ giao dịch thành công" });
    }
    return res.status(400).send("Mã giao dịch không hợp lệ");
  } catch (error) {
    return res.status(400).send(error);
  }
}

module.exports = {
  listAccount,
  detailAccount,
  updateStatus,
  listTransaction,
  acceptTransaction,
  declineTransaction,
};

export {};
