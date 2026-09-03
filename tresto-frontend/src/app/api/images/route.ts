import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_KEY_ID!,
    secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY!,
  },
});

export async function GET() {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.BACKBLAZE_BUCKET_NAME,
    });

    const response = await s3.send(listCommand);

    const files = (response.Contents || []).map((file) => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
      url: `${process.env.BACKBLAZE_ENDPOINT}/${process.env.BACKBLAZE_BUCKET_NAME}/${file.Key}`,
    }));

    return NextResponse.json({ success: true, files });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}