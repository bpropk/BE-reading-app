import * as jwt from "jsonwebtoken";

const Minio = require("minio");
const { User } = require("@schemas/users");
const { Book } = require("@schemas/books");
const fs = require("fs");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "WjG7DdcTeGFHHjxbJuwI",
  secretKey: "FgqAoJ1IqMvny7X43pgiX2NQPEXhj8d6msjdGi6P",
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneIllustration(data) {
  const srcIlu = data.split("/");
  const bucketName = srcIlu[0];
  const objectName = srcIlu[1];
  // download illustration to BE

  if (!fs.existsSync("downloads/" + objectName)) {
    minioClient.fGetObject(
      bucketName,
      objectName,
      "downloads/" + objectName,
      function (err) {
        if (err) {
          return console.log(err);
        }
      }
    );
  }

  return {
    bucketName,
    objectName,
  };
}

async function getUser(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const userId = decodedToken.id;
  const user = await User.findById({
    _id: userId,
  }).populate("library");
  return user;
}

async function getAllBookInfo(req, res) {
  try {
    var queryResult = await Book.find({}, null, { lean: true });
    if (req.query.subject) {
      queryResult = await Book.find(
        { subject: req.query.subject.toLowerCase() },
        null,
        {
          lean: true,
        }
      );
    }

    const records = queryResult.map((record) => {
      const { objectName } = cloneIllustration(record.illustration);

      return {
        ...record,
        illustration: "http://localhost:3200/public/" + objectName,
      };
    });

    return res.status(200).send({
      books: records,
    });
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
}

async function readBook(req, res) {
  const record = await Book.findOne(
    {
      _id: req.query.id,
    },
    null,
    { lean: true }
  );

  console.log("-------");
  console.log(record.epub);

  const { objectName } = await cloneIllustration(record.epub);
  const fileDownload = `downloads/` + objectName;
  await sleep(1000);

  return res.download(fileDownload);
}

async function bookDetailInfo(req, res) {
  try {
    var record = await Book.findOne(
      {
        _id: req.params.id,
      },
      null,
      { lean: true }
    );

    const { objectName } = cloneIllustration(record.illustration);
    record = {
      ...record,
      illustration: "http://localhost:3200/public/" + objectName,
    };

    return res.status(200).send({
      book: record,
    });
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
}

async function addLibrary(req, res) {
  var user = await getUser(req);

  console.log("req.body.id", req.body.id);
  const book = await Book.findById({
    _id: req.body.id,
  });

  const notExist = user.library.every(
    (item) => item._id.toString() !== book._id.toString()
  );

  if (notExist) {
    user.library = [...user.library, book];
    await user.save();
    return res.status(200).send({
      message: "add library success",
    });
  } else {
    return res.status(400).send({
      message: "library already add",
    });
  }
}

module.exports = {
  getAllBookInfo,
  readBook,
  bookDetailInfo,
  addLibrary,
};

export {};
