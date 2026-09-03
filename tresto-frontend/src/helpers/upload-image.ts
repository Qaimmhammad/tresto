import "server-only";
import blz from "@/backblaze";
import {
    PutObjectCommand,
    type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

export async function uploadLogoHelper(logo: File): Promise<string> {
    const logoExtension = logo.name.split(".").pop();
    const logoName = `${crypto.randomUUID()}.${logoExtension}`;
    const logoKey = `logo/${logoName}`;

    const logoBuffer = Buffer.from(await logo.arrayBuffer());

    const commandInput: PutObjectCommandInput = {
        Bucket: process.env.BACKBLAZE_BUCKET_NAME,
        Key: logoKey,
        Body: logoBuffer,
        ContentType: logo.type,
    };

    await blz.send(
        new PutObjectCommand(commandInput)
    );

    return `https://s3.ca-east-006.backblazeb2.com/tresto/${logoKey}`;
}

export async function uploadMealImage(image: File): Promise<string> {
    const imageExtension = image.name.split(".").pop();
    const imageName = `${crypto.randomUUID()}.${imageExtension}`;
    const imageKey = `images/${imageName}`;

    const imageBuffer = Buffer.from(await image.arrayBuffer());

    const commandInput: PutObjectCommandInput = {
        Bucket: process.env.BACKBLAZE_BUCKET_NAME,
        Key: imageKey,
        Body: imageBuffer,
        ContentType: image.type,
    };

    await blz.send(
        new PutObjectCommand(commandInput)
    );

    return `https://s3.ca-east-006.backblazeb2.com/tresto/${imageKey}`;
}