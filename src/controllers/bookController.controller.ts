const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "WjG7DdcTeGFHHjxbJuwI",
  secretKey: "FgqAoJ1IqMvny7X43pgiX2NQPEXhj8d6msjdGi6P",
});

var data: string[] = [];

async function getAllBookInfo(req, res) {
  const stream = minioClient.listObjects("reading-bucket", "", false);
  stream.on("data", function (obj) {
    data.push(obj);
  });
  stream.on("end", function (obj) {
    return res.status(200).send({
      data: data,
    });
  });
  stream.on("error", function (err) {
    return res.status(200).send({
      error: err,
    });
  });
}

async function getBookDetail(req, res) {
  var size = 0;
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
