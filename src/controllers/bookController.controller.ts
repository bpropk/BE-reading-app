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

// Get illustration from bucket Minio
function cloneIllustration(data) {
  const srcIlu = data.split("/");
  const bucketName = srcIlu[0];
  const objectName = srcIlu[1];
  // download illustration to BE
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
  return {
    bucketName,
    objectName,
  };
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
  // Get Book Detail from Minio
  minioClient.fGetObject(
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

async function BookDetailInfo(req, res) {
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

module.exports = {
  getAllBookInfo,
  readBook,
  BookDetailInfo,
};

export {};
