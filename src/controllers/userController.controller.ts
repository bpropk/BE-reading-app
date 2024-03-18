const utils = require("@utils/index");
const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "WjG7DdcTeGFHHjxbJuwI",
  secretKey: "FgqAoJ1IqMvny7X43pgiX2NQPEXhj8d6msjdGi6P",
});

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

async function personalInfo(req, res) {
  const user = await utils.getUser(req);
  return res.json(user);
}

async function getUserLibrary(req, res) {
  const user = await utils.getUser(req);
  const books = user.library;

  const records = books.map((record) => {
    const { objectName } = cloneIllustration(record.illustration);
    return {
      ...record,
      illustration: "http://localhost:3200/public/" + objectName,
    };
  });

  return res.status(200).send({
    books: records,
  });
}

module.exports = {
  personalInfo,
  getUserLibrary,
};

export {};
