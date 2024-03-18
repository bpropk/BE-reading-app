import { param } from "express-validator";
const Minio = require("minio");
const { Book } = require("@schemas/books");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "WjG7DdcTeGFHHjxbJuwI",
  secretKey: "FgqAoJ1IqMvny7X43pgiX2NQPEXhj8d6msjdGi6P",
});

async function getAllBookInfo(req, res) {
  try {
    var queryResult = await Book.find({});
    if (req.query.subject) {
      queryResult = await Book.find({ subject: req.query.subject });
    }

    return res.status(200).send({
      books: queryResult,
    });
  } catch (err) {
    return res.status(400).send({
      message: err,
    });
  }
}

async function getBookDetail(req, res) {
  const file = minioClient.fGetObject(
    "reading-bucket",
    "haggard-allans-wife(fantasy).epub",
    "downloads/download.epub",
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );

  const fileDownload = `downloads/download.epub`;

  res.download(fileDownload);
}

module.exports = {
  getAllBookInfo,
  getBookDetail,
};

export {};
