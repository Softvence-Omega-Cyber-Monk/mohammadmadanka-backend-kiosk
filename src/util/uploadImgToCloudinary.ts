import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import config from "../config";

// Function to delete a file from the local filesystem
const deleteFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err: any) {
    console.error(`Error deleting file: ${err.message}`);
  }
};

// Function to upload an image to Cloudinary
export const uploadImgToCloudinary = async (name: string, filePath: string) => {
  // Configuration for Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  try {
    // Upload an image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: name,
    });

    // Delete the file from the local filesystem after uploading it to Cloudinary
    // await deleteFile(filePath);

    // Return the upload result
    return uploadResult;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

// Function to handle multiple image uploads with auto-generated names
export const uploadMultipleImages = async (filePaths: string[]) => {
  // cloudinary.config({
  //   cloud_name: config.cloudinary_name,
  //   api_key: config.cloudinary_api_key,
  //   api_secret: config.cloudinary_api_secret,
  // });

  try {
    const imageUrls: string[] = [];

    for (const filePath of filePaths) {
      // Generate a unique name for each image
      const imageName = `${Math.floor(100 + Math.random() * 900)}-${Date.now()}`;

      const uploadResult = await uploadImgToCloudinary(imageName, filePath);
      imageUrls.push(uploadResult.secure_url);
    }

    return imageUrls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Multiple image upload failed");
  }
}

export const deleteImageFromCloudinary = async (publicId: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  console.log("Deleting image from Cloudinary with public ID:", publicId);
  try {
    // Delete the image from Cloudinary using its public ID
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Image deletion failed");
  }
};

// Multer storage configuration for local file saving
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads")); // Define folder for temporary file storage
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    //cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    cb(null, file.fieldname + "-" + uniqueSuffix); // Generate unique file name
  },
});

// Multer upload setup
export const upload = multer({ storage: storage });
