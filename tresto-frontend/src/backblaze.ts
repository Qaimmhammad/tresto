import { S3Client } from "@aws-sdk/client-s3";

const backblaze = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,

  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID!,
    secretAccessKey:
      process.env.BACKBLAZE_APPLICATION_KEY!,
  },
});

export default backblaze ;