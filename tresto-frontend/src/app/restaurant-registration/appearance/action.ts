"use server";

import {uploadLogoHelper} from "@/helpers/upload-image";

export default async function uploadLogo(
  image: File
) {
  console.log("UPLOAD LOGO ACTION:", {
        name: image.name,
        size: image.size,
        type: image.type,
    });
  return await uploadLogoHelper(image);
}