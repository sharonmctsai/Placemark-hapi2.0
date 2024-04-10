import { db } from "../models/db.js";

export const categoryController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // eslint-disable-next-line prefer-destructuring
      const category = request.query.category;
      const placemarks = await db.placemarkStore.getPlacemarksByUserIdAndCategory(loggedInUser._id, category);
      const viewData = {
        title: "Categories",
        user: loggedInUser,
        placemarks: placemarks,
      };
      return h.view("category-view", viewData);
    },
  },
};
