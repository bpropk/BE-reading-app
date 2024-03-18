import mongoose from "mongoose";

const user = require("@schemas/users");
const book = require("@schemas/books");

const userModel = mongoose.model("user", user.UserSchema);
const bookModel = mongoose.model("book", book.BookSchema);

const { UserRole, UserStatus } = require("../utils/enum/user");
const { BookSubject } = require("../utils/enum/book");

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

async function seedBooks() {
  try {
    await bookModel.create({
      title: "Darkwater",
      author: "W. E. B. Du Bois",
      description:
        "The distinguished American civil rights leader, Du Bois first published these fiery essays, sketches, and poems individually nearly 100 years ago in the Atlantic, the Journal of Race Development, and other periodicals. Reflecting the author’s ideas as a politician, historian, and artist, this volume has long moved and inspired readers with its militant cry for social, political, and economic reforms for black Americans. Essential reading for students of African-American history.",
      subject: BookSubject.History,
      epub: "reading-bucket/bois-darkwater(history).epub",
      illustration: "illustration/darkwater.jpg",
      star: 0,
      numberReview: 0,
      price: 10.1,
    });
  } catch (error) {
    console.log("Book have been add");
  }
}

module.exports = {
  seedUser,
  seedBooks,
};

export {};
