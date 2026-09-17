"use server";

import {uploadLogoHelper} from "@/helpers/upload-image";

export default async function uploadLogo(
  image: File
) {
  return await uploadLogoHelper(image);
}