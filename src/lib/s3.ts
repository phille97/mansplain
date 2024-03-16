"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Bucket = "lillagumman";
const s3BucketRegion = process.env.S3_UPLOAD_REGION || "eu-north-1";
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_UPLOAD_SECRET_ACCESS_KEY || "",
  },
  region: s3BucketRegion,
})


export const uploadToS3 = async (name: string, data: Response) => {
  const buffer = Buffer.from(await (await data.blob()).arrayBuffer());

  const command = new PutObjectCommand({
    Bucket: s3Bucket,
    Key: name,
    Body: buffer,
  });

  try {
    await s3.send(command);
    return "https://"+s3Bucket+".s3."+s3BucketRegion+".amazonaws.com/" + name
  } catch (err) {
    console.log(err)
    return false
  }
}
