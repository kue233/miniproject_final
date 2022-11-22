import dotenv from "dotenv";
import aws from "aws-sdk";
import crypto from "crypto";
import { promisify } from "util";
import { param } from "../routes/Profile";
const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

/** config */
const region = "us-east-1";
const bucketName = "fe-image-upload";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

export async function generateUploadURL() {
  const rawBytes = await randomBytes(16);

  const imageName = rawBytes.toString("hex");
  // return [rawBytes, imageName];
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}

export async function deletePicUrl(key: string) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      console.log(`deleted data: ${data}`);
    }
  });
}
