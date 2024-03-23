const moduleAlias = require("module-alias");
moduleAlias.addAliases({
  "@controllers": `${__dirname}/src/controllers`,
  "@schemas": `${__dirname}/src/schemas`,
  "@routes": `${__dirname}/src/routes`,
  "@utils": `${__dirname}/src/utils`,
  "@middlewares": `${__dirname}/src/middlewares`,
  "@downloads": `${__dirname}/downloads`,
});
const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3200;
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(multer().array());
app.use("/public", express.static("downloads"));

/* routes */
const auth = require("@routes/authentication");
const admin = require("@routes/admin");
const user = require("@routes/user");
const book = require("@routes/book");

app.use("/auth", auth);
app.use("/admin", admin);
app.use("/user", user);
app.use("/book", book);

/* seeder */
const seeder = require("@utils/seeder");

/* Error handler middleware */
app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

/* listener  */
const start = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/reading-app");
    mongoose.set("debug", true);

    // seedUser
    // await seeder.seedUser();

    // seedBook
    // await seeder.seedBooks();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
