const { Book } = require("@schemas/books");
const utils = require("@utils/index");
const Minio = require("minio");

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

    const records = queryResult.map((record) => {
      const { objectName } = utils.cloneIllustration(record.illustration);
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

async function bookDetailInfo(req, res) {
  try {
    var record = await Book.findOne(
      {
        _id: req.params.id,
      },
      null,
      { lean: true }
    );

    const { objectName } = utils.cloneIllustration(record.illustration);
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
  const user = await utils.getUser(req);
  const book = await Book.findOne({
    _id: req.body.id,
  });

  console.log("user", user);
  console.log("book", book);

  const checkExist = user.library.every((item) => {
    return item._id === book._id;
  });

  if (checkExist) {
    user.library = [...user.library, book];
    await user.save();
    return res.status(200).send({
      message: "add library success",
    });
  } else {
    return res.status(200).send({
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
