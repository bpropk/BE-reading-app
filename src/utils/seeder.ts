import { addDays } from "date-fns";
import mongoose from "mongoose";

const user = require("@schemas/users");
const card = require("@schemas/cards");
const audit = require("@schemas/audits");

const userModel = mongoose.model("user", user.UserSchema);
const cardModel = mongoose.model("card", card.CardSchema);
const auditModel = mongoose.model("audit", audit.AuditSchema);

const { UserRole, UserStatus } = require("../utils/enum/user");
const bcrypt = require("bcrypt");

async function seedUser() {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const adminPassword = 123456;
  const hashPassword = await bcrypt.hashSync(adminPassword.toString(), salt);
  try {
    await userModel.create({
      username: "admin",
      password: hashPassword,
      role: UserRole.Admin,
    });
  } catch (error) {
    console.log("Admin Account have been add");
  }

  try {
    await userModel.create({
      username: "user",
      password: hashPassword,
      phone: "0909754993",
      email: "bpropk2@gmail.com",
      name: "Trần Thanh Bình",
      dateOfBirth: "2000-12-20",
      address: "83/21 Đào Tông Nguyên",
      role: UserRole.User,
      status: UserStatus.Active,
      currentbudget: 0,
      lock: {
        lockCount: 0,
        lockWrongPassword: 0,
        date: new Date(),
      },
    });
  } catch (error) {
    console.log("User Account have been add");
  }
}

async function seedCard() {
  try {
    await cardModel.create({
      id: 111111,
      expiredDate: new Date("10/10/2022"),
      secretCode: 411,
      cash: "5000000",
    });
  } catch (error) {
    console.log("Card have been add");
  }

  try {
    await cardModel.create({
      id: 222222,
      expiredDate: addDays(new Date(), 30),
      secretCode: 443,
      cash: "5000000",
    });
  } catch (error) {
    console.log("Card have been add");
  }

  try {
    await cardModel.create({
      id: 333333,
      expiredDate: addDays(new Date(), 30),
      secretCode: 577,
      cash: "5000000",
    });
  } catch (error) {
    console.log("Card have been add");
  }
}

module.exports = {
  seedUser,
  seedCard,
};

export {};
