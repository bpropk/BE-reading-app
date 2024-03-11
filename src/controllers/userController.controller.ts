import { compareDesc } from "date-fns";
import * as jwt from "jsonwebtoken";
const { User } = require("@schemas/users");
const { Card } = require("@schemas/cards");
const { Audit } = require("@schemas/audits");
const random = require("randomstring");

const {
  historyType,
  statusTransaction,
  telecomTransaction,
  telecomNumber,
} = require("../utils/enum/audit");

async function getUser(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const userId = decodedToken.id;
  const user = await User.findById({
    _id: userId,
  });
  return user;
}

async function personalInfo(req, res) {
  const user = await getUser(req);
  return res.json(user);
}

async function depositMoneyIntoWallet(req, res) {
  const { cardId, secretCode, money, message } = req.body;
  const user = await getUser(req);

  const card = await Card.findOne({
    id: cardId,
  });

  if (!card) {
    return res.status(400).send({ message: "Thẻ này không được hỗ trợ" });
  }
  if (card.secretCode != secretCode) {
    return res.status(400).send({ message: "CCV không hợp lệ" });
  }
  if (compareDesc(new Date(), card.expiredDate) === -1) {
    return res.status(400).send({ message: "Thẻ này đã hết hạn" });
  }
  if (money >= card.cash) {
    return res.status(400).send({ message: "Số tiền gửi không hợp lệ" });
  }
  card.cash -= money;
  await card.save();
  user.currentbudget = Number(user.currentbudget) + Number(money);
  await user.save();

  await Audit.create({
    account: user._id,
    type: historyType.deposit,
    card: card._id,
    status: statusTransaction.accept,
    transferMoney: money,
    message,
  });

  return res.status(200).send({ message: "Rút tiền thành công" });
}

async function widthdrawMoney(req, res) {
  const { cardId, secretCode, money, message } = req.body;
  const user = await getUser(req);

  const card = await Card.findOne({
    id: cardId,
  });

  if (!card) {
    return res.status(400).send({ message: "Thẻ này không được hỗ trợ" });
  }
  if (card.secretCode != secretCode) {
    return res.status(400).send({ message: "CCV không hợp lệ" });
  }
  if (compareDesc(new Date(), card.expiredDate) === -1) {
    return res.status(400).send({ message: "Thẻ này đã hết hạn" });
  }
  if (!(money % 50000 === 0)) {
    return res
      .status(400)
      .send({ message: "Số tiền rút là bội số của 50,000 đ" });
  }
  if (money >= user.currentbudget) {
    return res.status(400).send({ message: "Số tiền rút không hợp lệ" });
  }
  if (money > 5000000) {
    await Audit.create({
      account: user._id,
      type: historyType.widthdraw,
      card: card._id,
      status: statusTransaction.depositPending,
      transferMoney: money * 0.95,
      message,
    });
    return res.status(200).send({ message: "Chờ xét duyệt" });
  }
  card.cash += money * 0.95;
  await card.save();
  user.currentbudget = Number(user.currentbudget) - Number(money * 0.95);
  await user.save();

  await Audit.create({
    account: user._id,
    type: historyType.widthdraw,
    card: card._id,
    status: statusTransaction.accept,
    transferMoney: money * 0.95,
    message,
  });
  return res.status(200).send({ message: "Rút tiền thành công" });
}

async function transferMoney(req, res) {
  const { money, message, phone } = req.body;
  const user = await getUser(req);

  const trasnferAccount = await User.findOne({
    phone: phone,
  });

  if (!trasnferAccount) {
    return res.status(400).send({ message: "Tài khoảng không tồn tại" });
  }
  if (!(money % 50000 === 0)) {
    return res
      .status(400)
      .send({ message: "Số tiền rút là bội số của 50,000 đ" });
  }
  if (money >= user.currentbudget) {
    return res.status(400).send({ message: "Số tiền gửi không hợp lệ" });
  }

  trasnferAccount.currentbudget += money * 0.95;
  await trasnferAccount.save();
  user.currentbudget = Number(user.currentbudget) - Number(money * 0.95);
  await user.save();

  await Audit.create({
    account: user._id,
    type: historyType.transfer,
    recievedAccount: phone,
    status: statusTransaction.accept,
    transferMoney: money * 0.95,
    message,
  });
  return res.status(200).send({ message: "Chuyển tiền thành công" });
}

async function buyPhoneCard(req, res) {
  const { money, telecom, quantity } = req.body;
  const user = await getUser(req);

  if (
    telecom !== telecomTransaction.Viettel &&
    telecom !== telecomTransaction.Mobifone &&
    telecom !== telecomTransaction.Vinaphone
  ) {
    return res.status(400).send({ message: "Nhà mạng không hợp lệ" });
  }
  if (quantity > 5 || quantity < 1) {
    return res.status(400).send({ message: "Số lượng không hợp lệ" });
  }
  if (money * quantity > user.currentbudget) {
    return res
      .status(400)
      .send({ message: "Số dư tài khoảng không đủ để thực hiện giao dịch" });
  }

  user.currentbudget = Number(user.currentbudget) - Number(money * quantity);
  await user.save();

  let listCard = [] as any;
  for (let i = 0; i < quantity; i++) {
    const randomNumber = random.generate({
      length: 5,
      charset: "numeric",
    });
    listCard.push({
      telecomTransaction: telecom,
      telecomAccount: `${telecomNumber[telecom]}${randomNumber}`,
      telecomPrice: money,
    });

    await Audit.create({
      account: user._id,
      type: historyType.buy,
      status: statusTransaction.accept,
      telecomTransaction: telecom,
      telecomAccount: `${telecomNumber[telecom]}${randomNumber}`,
      telecomPrice: money,
    });
  }

  return res.status(200).send({
    message: "Mua thẻ thành công",
    items: listCard,
  });
}

async function historyTransaction(req, res) {
  const user = await getUser(req);
  const historyTransaction = await Audit.find({
    account: user._id,
  }).sort({ createdAt: -1 });

  return res.json(historyTransaction);
}

async function historyTransactionDetail(req, res) {
  try {
    const historyTransaction = await Audit.findOne({
      _id: req.params.id,
    });
    if (!historyTransaction) {
      return res
        .status(400)
        .send({ message: "chi tiết giao dịch không tồn tại" });
    }
    return res.json(historyTransaction);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "chi tiết giao dịch không tồn tại" });
  }
}

module.exports = {
  personalInfo,
  depositMoneyIntoWallet,
  widthdrawMoney,
  transferMoney,
  buyPhoneCard,
  historyTransaction,
  historyTransactionDetail,
};

export {};
