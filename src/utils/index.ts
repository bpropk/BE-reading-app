import * as jwt from "jsonwebtoken";
const Minio = require("minio");
const { User } = require("@schemas/users");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "WjG7DdcTeGFHHjxbJuwI",
  secretKey: "FgqAoJ1IqMvny7X43pgiX2NQPEXhj8d6msjdGi6P",
});

// Get illustration from bucket Minio
async function cloneIllustration(data) {
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

async function getUser(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const userId = decodedToken.id;
  const user = await User.findById({
    _id: userId,
  }).populate("library");
  return user;
}

module.exports = {
  getUser,
  cloneIllustration,
};

export {};
