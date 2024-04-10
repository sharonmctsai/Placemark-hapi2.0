import { v4 } from "uuid";

let placemarks = [];

export const placemarkMemStore = {
  async getAllPlacemarks() {
    return placemarks;
  },

  async addPlacemark(userId, placemark) {
    placemark._id = v4();
    placemark.userId = userId;
    placemarks.push(placemark);
    return placemark;
  },

  async getPlacemarksByUserId(userId) {
    return placemarks.filter((placemark) => placemark.userId === userId);
  },

  async getPlacemarkById(id) {
    return placemarks.find((placemark) => placemark._id === id) || null;
  },

  async deletePlacemark(id) {
    placemarks = placemarks.filter((placemark) => placemark._id !== id);
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  },

  async updatePlacemark(placemarkId, updatedPlacemark) {
    const index = placemarks.findIndex((placemark) => placemark._id === placemarkId);
    if (index !== -1) {
      placemarks[index].title = updatedPlacemark.title;
      placemarks[index].description = updatedPlacemark.description;
      placemarks[index].location = updatedPlacemark.location;
      placemarks[index].latitude = updatedPlacemark.latitude;
      placemarks[index].longitude = updatedPlacemark.longitude;
      placemarks[index].rating = updatedPlacemark.rating;
      placemarks[index].review = updatedPlacemark.review;


      placemarks[index].category = updatedPlacemark.category;
    }
  } ,

  async addFavorite(userId, placemarkId) {
    if (!favoritePlacemarks[userId]) {
      favoritePlacemarks[userId] = [];
    }
    if (!favoritePlacemarks[userId].includes(placemarkId)) {
      favoritePlacemarks[userId].push(placemarkId);
    }
  },

  async removeFavorite(userId, placemarkId) {
    if (favoritePlacemarks[userId]) {
      favoritePlacemarks[userId] = favoritePlacemarks[userId].filter((id) => id !== placemarkId);
    }
  },

  async getFavoritePlacemarks(userId) {
    return favoritePlacemarks[userId] || [];
  },
};
