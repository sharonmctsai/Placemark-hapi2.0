// import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// configure cloudinary
const credentials = {
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
};
cloudinary.config(credentials);


const image = './public/images/spire.jpg';

(async function run() {
  try {
    const result = await cloudinary.uploader.upload(image);
    console.log(result);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
  }
})();

// export the imageStore object
export const imageStore = {

  // function to get all images
  getAllImages: async function() {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  // function to upload an image
  uploadImage: async function(imagefile) {
    writeFileSync("./public/spire.jpg", imagefile);
    const response = await cloudinary.v2.uploader.upload("./public/spire.jpg");
    return response.url;
  },

  // function to delete an image (if it exists in Cloudinary as we have images in the oublic folder that we don't want to delete)
  deleteImage: async function(img) {
    // check if the image name contains "cloudinary"
    if (img.includes("cloudinary")) {
      // if it does, delete the image from Cloudinary
      await cloudinary.v2.uploader.destroy(img, {});
    } else {
      // if not, we log a message to the console
      console.log("Image not stored on Cloudinary, skipping deletion.");
    }
  }
};