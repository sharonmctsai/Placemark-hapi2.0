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
  async addFavoritePlacemark(userId, placemarkId) {
    const user = await this.getUserById(userId);
    if (user) {
      if (!user.favoritePlacemarks) {
        user.favoritePlacemarks = [];
      }
      user.favoritePlacemarks.push(placemarkId);
      await this.updateUser(userId, user);
    }
  },
  
  async getFavoritePlacemarks(userId) {
    const user = await this.getUserById(userId);
    if (user && user.favoritePlacemarks) {
      const favoritePlacemarks = await Promise.all(user.favoritePlacemarks.map(async (placemarkId) => {
        return await this.getPlacemarkById(placemarkId);
      }));
      return favoritePlacemarks.filter((placemark) => placemark !== null);
    }
    return [];
  },
  

  
};
