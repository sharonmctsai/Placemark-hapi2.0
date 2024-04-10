import { v4 } from "uuid";
import { db } from "./store-utils.js";

// export placemarkJsonStore object
export const placemarkJsonStore = {
  async getAllPlacemarks() {
    await db.read();
    return db.data.placemarks;
  },

  // function to add a placemark
  async addPlacemark(userId, placemark) {
    await db.read();
    placemark._id = v4();
    placemark.userId = userId;
    db.data.placemarks.push(placemark);
    await db.write();
    return placemark;
  },

  // function to get placemarks by user id
  async getPlacemarksByUserId(id) {
    await db.read();
    return db.data.placemarks.filter((placemark) => placemark.userId === id);
  },

  // function to get placemarks by user id and category
  async getPlacemarksByUserIdAndCategory(id, category) {
    await db.read();
    return db.data.placemarks.filter((placemark) => placemark.userId === id && placemark.category === category);
  },

  // function to get placemark by id
  async getPlacemarkById(id) {
    await db.read();
    return db.data.placemarks.find((placemark) => placemark._id === id);
  },

  // function to delete a placemark by id
  async deletePlacemark(id) {
    await db.read();
    const index = db.data.placemarks.findIndex((placemark) => placemark._id === id);
    if (index >= 0) {
      db.data.placemarks.splice(index, 1);
      await db.write();
    } else {
      console.log("Placemark not found");
    }
    return null;
  },

  // function to delete all placemarks
  async deleteAllPlacemarks() {
    db.data.placemarks = [];
    await db.write();
  },

  // function to update a placemark image
  async updatePlacemarkImage(placemarkId, imageUrl) {
    await db.read();
    const retrievedPlacemark = db.data.placemarks.find((placemark) => placemark._id === placemarkId);
    retrievedPlacemark.img = imageUrl;
    await db.write();
  },

  // function to update a placemark
  async updatePlacemark(placemarkId, updatedPlacemark) {
    const retrievedPlacemark = await this.getPlacemarkById(placemarkId);
    retrievedPlacemark.title = updatedPlacemark.title;
    retrievedPlacemark.description = updatedPlacemark.description;
    retrievedPlacemark.location = updatedPlacemark.location;
    retrievedPlacemark.latitude = updatedPlacemark.latitude;
    retrievedPlacemark.longitude = updatedPlacemark.longitude;
    retrievedPlacemark.rating = updatedPlacemark.rating;
    retrievedPlacemark.review = updatedPlacemark.review;

    retrievedPlacemark.category = updatedPlacemark.category;
    await db.write();
    return retrievedPlacemark;
  },

 
};
