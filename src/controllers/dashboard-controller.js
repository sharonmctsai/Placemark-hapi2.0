import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";
import axios from 'axios';

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const placemarks = await db.placemarkStore.getPlacemarksByUserId(loggedInUser._id);
      const viewData = {
        title: "Placemark Dashboard",
        user: loggedInUser,
        placemarks: placemarks,
      };
      console.log(" dashboard view...")
      return h.view("dashboard-view", viewData);
    },
  },

  // function to add a placemark, payload is checked against PlacemarkSpec schema
  addPlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        return h.view("dashboard-view", { title: "Add placemark error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPlacemark = {
        title: request.payload.title,
        description: request.payload.description,
        location: request.payload.location,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        rating: request.payload.rating,
        review: request.payload.review,

        category: request.payload.category,
      };
      console.log("adding new placemark: ", newPlacemark);
      await db.placemarkStore.addPlacemark(loggedInUser._id, newPlacemark);
      return h.redirect("/dashboard");
    },
  },

  updatePlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const placemarkId = request.params.id;
        const oldPlacemark = await db.placemarkStore.getPlacemarkById(placemarkId);
        return h
          .view("update-placemark", {
            title: "Update Placemark",
            placemark: oldPlacemark,
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const oldPlacemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const updatedPlacemark = {
        title: request.payload.title,
        description: request.payload.description,
        location: request.payload.location,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        rating: request.payload.rating,
        category: request.payload.category,
      };
      console.log("updating placemark : ", oldPlacemark._id);
      await db.placemarkStore.updatePlacemark(oldPlacemark._id, updatedPlacemark);
      return h.redirect("/dashboard");
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        // retrieve the placemark by id
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        // retrieve the image file from the payload
        const file = request.payload.imagefile;
        // if the file is not empty, upload the image and update the placemark with the image URL
        if (Object.keys(file).length > 0) {
          // retrieve the image URL from the imageStore
          const url = await imageStore.uploadImage(request.payload.imagefile);
          placemark.img = url;
          // update the placemark with the image URL parameter
          await db.placemarkStore.updatePlacemarkImage(placemark._id, url);
          console.log("image uploaded: ", url);
        }
        return h.redirect("/dashboard");
      } catch (err) {
        console.log(err);
        return h.redirect("/dashboard");
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  showUpdatePlacemarkForm: {
    handler: async function (request, h) {
      try {
        const placemarkId = request.params.id;
        const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
        if (!placemark) {
          // If placemark doesn't exist, handle the error appropriately
          return h.view("error-view", { error: "Placemark not found" }).code(404);
        }
        console.log(" update placemark ...")
        return h.view("update-placemark", { placemark });
      } catch (error) {
        // Handle other errors (e.g., database connection error)
        console.error("Error retrieving placemark:", error);
        return h.view("error-view", { error: "An error occurred while retrieving the placemark" }).code(500);
      }
    },
  },


  showUploadImageForm: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
      console.log(" upload image ...")
      return h.view("partials/placemark-image", { placemark });
    },
  },

  showProfile: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      return h.view("profile-view", { user: loggedInUser });
    },
  },

  deletePlacemark: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
      // checking if there is in fact an associated image before attempting to delete it
      if (placemark.img) {
        const imgURLParts = placemark.img.split("/");
        const publicId = imgURLParts[imgURLParts.length - 1].split(".")[0]; // removing the extension by turning the URL into an array delimited by the . and then removing the last element
        console.log("deleting image from database -> publicId: ", publicId)
        await imageStore.deleteImage(publicId);
      }
      await db.placemarkStore.deletePlacemark(placemarkId);
      return h.redirect("/dashboard");
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
      // splitting the image URL to get the public ID (the last segment of the URL) delimited by the /
      const imgURLParts = placemark.img.split("/");
      // removing the extension by turning the URL into an array delimited by the . and then removing the last element
      const publicId = imgURLParts[imgURLParts.length - 1].split(".")[0];
      // passing the public ID to the deleteImage function in the imageStore
      console.log("deleting placemark image -> publicId: ", publicId)
      await imageStore.deleteImage(publicId);
      // setting the image URL to null and updating the placemark via the updatePlacemarkImage function in the placemarkStore
      placemark.img = null;
      await db.placemarkStore.updatePlacemarkImage(placemark._id, null);
      return h.redirect("/dashboard");
    },
  },
 

  sharePlacemark: {
    handler: async function (request, h) {
      try {
        const placemarkId = request.params.id;
        // Make a request to the server to get the shareable link
        const response = await axios.get(`http://0.0.0:3000/api/share/placemark/${placemarkId}`);
        const { url } = response.data;
  
        // Open a new window with the shareable link
        window.open(url, '_blank', 'noopener noreferrer');
  
        // Respond with a success message or whatever is appropriate
        return h.response().code(200);
      } catch (error) {
        console.error('Failed to retrieve shareable link:', error);
        return h.response('Failed to retrieve shareable link').code(500);
      }
    }
  },
 


  addToFavorites: {
    handler: async function (request, h) {
      try {
        const placemarkId = request.params.id;
        const loggedInUser = request.auth.credentials;
        
        // Add placemark to user's favorites
        await db.userStore.addToFavorites(loggedInUser._id, placemarkId);
  
        // Redirect to dashboard or favorites page
        return h.redirect("/dashboard");
      } catch (error) {
        console.error('Failed to add placemark to favorites:', error);
        return h.response('Failed to add placemark to favorites').code(500);
      }
    }
  },
  showFavorites: {
    handler: async function (request, h) {
      try {
        const loggedInUser = request.auth.credentials;
        
        // Fetch user's favorite placemarks from the database
        const favoritePlacemarks = await db.userStore.getFavoritePlacemarks(loggedInUser._id);
  
        // Render the favorite view page with the list of favorite placemarks
        return h.view("favorite-view", { favoritePlacemarks });
      } catch (error) {
        console.error('Failed to retrieve favorite placemarks:', error);
        return h.view("error-view", { error: "An error occurred while retrieving favorite placemarks" }).code(500);
      }
    }
  }
};

