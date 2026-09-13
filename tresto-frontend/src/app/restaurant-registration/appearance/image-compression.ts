import imageCompression from "browser-image-compression";

export default async function compressImage(file: File) : Promise<File> {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: false,
        fileType: "image/webp"
    }
    const compressedImage = await imageCompression(file, options);
    return compressedImage; 
}
