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

    // Get illustration from bucket Minio
    const records = queryResult.map((record) => {
      const srcIlu = record.illustration.split("/");
      const bucketName = srcIlu[0];
      const objectName = srcIlu[1];
      // download illustration to BE
      const file = minioClient.fGetObject(
        bucketName,
        objectName,
        "downloads/" + objectName,
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );
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

async function getBookDetail(req, res) {
  // Get Book Detail from Minio
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
