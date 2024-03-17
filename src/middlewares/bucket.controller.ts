import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

export const bucket = "dev-multer-s3-bucket";

export const s3 = new AWS.S3({
  endpoint: "http://127.0.0.1:9000",
  accessKeyId: "ly1y6iMtYf",
  secretAccessKey: "VNcmMuDARGGstqzkXF1Van1Mlki5HGU9",
  sslEnabled: false,
  s3ForcePathStyle: true,
});

const storage = multerS3({
  s3,
  bucket,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, Date.now().toString());
  },
});

export const upload = multer({ storage });
