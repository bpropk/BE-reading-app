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
  // History book
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

  try {
    await bookModel.create({
      title: "Death in the Afternoon",
      author: "Ernest Hemingway",
      description:
        "Still considered one of the best books ever written about bullfighting, this is an impassioned look at the sport by one of its true aficionados. It reflects Hemingway’s conviction that bullfighting was more than mere sport and reveals a rich source of inspiration for his art. The unrivaled drama of bullfighting, with its rigorous combination of athleticism and artistry, and its requisite display of grace under pressure, ignited Hemingway’s imagination. Here he describes and explains the technical aspects of this dangerous ritual and “the emotional and spiritual intensity and pure classic beauty that can be produced by a man, an animal, and a piece of scarlet serge draped on a stick.” Seen through his eyes, bullfighting becomes a richly choreographed ballet, with performers who range from awkward amateurs to masters of great elegance and cunning. A fascinating look at the history and grandeur of bullfighting, Death in the Afternoon is also a deeper contemplation of the nature of cowardice and bravery, sport and tragedy, and is enlivened throughout by Hemingway’s sharp commentary on life and literature.",
      subject: BookSubject.History,
      epub: "reading-bucket/hemingway-death-in-the-afternoon(history).epub",
      illustration: "illustration/death-in-the-afternoon.jpg",
      star: 0,
      numberReview: 0,
      price: 14,
    });
  } catch (error) {
    console.log(error);
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Discourses on Livy",
      author: "Niccolò Machiavelli",
      description:
        "The Discourses on the First Decade of Titus Livius is one of the masterpieces by Machiavelli. This work narrates the writer’s comments as to how a democratic government should be established. Through the comparison of Venice and Rome a detailed analysis of different kinds of governments is given. Machiavelli has ingeniously presented different aspects of his own contentions. Thought-provoking!",
      subject: BookSubject.History,
      epub: "reading-bucket/machiavelli-discourses-on-livy(history).epub",
      illustration: "illustration/discourses-on-livy.jpg",
      star: 0,
      numberReview: 0,
      price: 20,
    });
  } catch (error) {
    console.log("Book have been add");
  }

  try {
    await bookModel.create({
      title: "Henry VII",
      author: "Charles Williams",
      description:
        "Henry VII is less spectacular than his descendants, but not less interesting or even exciting. The first of the Tudors has been less written about than any (except Edward VI). He supplanted a dynasty and subordinated an aristocracy; he collected a treasure and created a fleet. But he created also the engine of monarchy. He did this because his desires were never at odds with his intentions: he possessed an equilibrium greater than any other Tudor-even Elizabeth. That fixed equilibrium of his mind released a very high industry and decision. In his later life his methods a little overcame him; his suspicion, his caution, his acquisitiveness escaped control. It was then that by certain general measures and especially by one little particular act he prepared the way for the destruction of that engine of monarchy he had created. The reign of Henry VII was the seed of the future, but it was already worm-eaten.",
      subject: BookSubject.History,
      epub: "reading-bucket/williams-henry-vii(history).epub",
      illustration: "illustration/henry-vii.jpg",
      star: 0,
      numberReview: 0,
      price: 14,
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
