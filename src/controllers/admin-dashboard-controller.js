/* eslint-disable prefer-destructuring */
import { db } from "../models/db.js";
import {
  calculateTotalPlacemarks,
  calculateMostPopularCategory,
  calculatePlacemarksPerCategory,
  calculateMostActiveUser,
} from "../analytics-utils.js";

export const adminDashboardController = {
  index: {
    handler: async function (request, h) {
      const users = await db.userStore.getAllUsers();
   
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          const placemarks = await db.placemarkStore.getPlacemarksByUserId(user._id);
          user.placemarkCount = placemarks.length;
          return user;
        })
      );
      const viewData = {
        title: "Admin Dashboard",
        users: updatedUsers,
      };
      console.log(" admin dashboard view...");
      return h.view("admin-dashboard-view", viewData);
    },
  },

  showAnalytics: {
    handler: async function (request, h) {
      const users = await db.userStore.getAllUsers();
      const placemarks = await db.placemarkStore.getAllPlacemarks();
      const totalPlacemarks = await calculateTotalPlacemarks(placemarks);
      const mostPopularCategory = await calculateMostPopularCategory(placemarks);
      const placemarksPerCategory = await calculatePlacemarksPerCategory(placemarks);
      const mostActiveUser = await calculateMostActiveUser(users);

      const viewData = {
        title: "Placemark Analytics",
        users: users.length,
        placemarks: placemarks.length,
        placemarksPerCategory: placemarksPerCategory,
        mostPopularCategory: mostPopularCategory,
        mostActiveUser: mostActiveUser,
      };
      console.log(" analytics view...");
      return h.view("analytics-view", viewData);
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      await db.userStore.deleteUserById(request.params.id);
      return h.redirect("/admin");
    },
  },
};
