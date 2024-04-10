import Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import { db } from "../models/db.js";
import { PlacemarkSpec, PlacemarkPlusSpec, IdSpec, PlacemarkArraySpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { decodeToken, validate } from "./jwt-utils.js";

export const placemarkApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const decodedToken = decodeToken(request.headers.authorization);
      if (decodedToken.role !== "admin") {
        return Boom.forbidden("Only admins can view all placemarks");
      }
      try {
        const placemarks = await db.placemarkStore.getAllPlacemarks();
        return placemarks;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: PlacemarkArraySpec, failAction: validationError },
    description: "Get all placemarks",
    notes: "Returns all placemarks",
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const foundPlacemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        if (!foundPlacemark) {
          return Boom.notFound("No placemark with this id");
        }
        return foundPlacemark;
      } catch (err) {
        return Boom.serverUnavailable("No placemark with this id");
      }
    },
    tags: ["api"],
    description: "Find a placemark",
    notes: "Returns a placemark",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PlacemarkPlusSpec, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        // decode and validate the JWT token

        const decodedToken = decodeToken(request.headers.authorization);
        const validationResult = await validate(decodedToken, request);
        if (!validationResult.isValid) {
          return Boom.unauthorized("Invalid credentials");
        }
        // access user ID from decoded payload
        // eslint-disable-next-line prefer-destructuring
        const userId = decodedToken.userId;
        // access new placemark data from request payload
        const newPlacemark = request.payload;
        // add userId to the new placemark data
        newPlacemark.userId = userId;
        // proceed with placemark creation using the retrieved user id
        const result = await db.placemarkStore.addPlacemark(userId, newPlacemark);
        if (result) {
          const resultObject = result.toObject();
          return h.response(resultObject).code(201);
        }
        return Boom.badImplementation("Error creating placemark");
      } catch (error) {
        return Boom.serverUnavailable("Database Error - check that a valid user id was provided");
      }
    },
    tags: ["api"],
    description: "Create a Placemark",
    notes: "Returns the newly created placemark",
    validate: { payload: PlacemarkSpec },
    response: { schema: PlacemarkPlusSpec, failAction: validationError },
  },
  
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const decodedToken = decodeToken(request.headers.authorization);
      // check the role of the user and throw error if they are not an admin
      if (decodedToken.role !== "admin") {
        return Boom.forbidden("Only admins can delete all placemarks");
      }
      try {
        await db.placemarkStore.deleteAllPlacemarks();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all placemarks",
  },

  // function to delete a single placemark by id
  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        console.log(placemark);
        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }
        await db.placemarkStore.deletePlacemark(request.params.id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a placemark",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

// function to update a placemark
update: {
  auth: {
    strategy: "jwt",
  },
  handler: async function (request, h) {
    try {
      // decode and validate the JWT token
      const decodedToken = decodeToken(request.headers.authorization);
      const validationResult = await validate(decodedToken, request);
      if (!validationResult.isValid) {
        return Boom.unauthorized("Invalid credentials");
      }
      // access user ID from decoded payload
      // eslint-disable-next-line prefer-destructuring
      const userId = decodedToken.userId;
      // access updated placemark data from request payload
      const updatedPlacemark = request.payload;
      // add userId to the updated placemark data
      updatedPlacemark.userId = userId;
      // proceed with updating the placemark
      const placemarkId = request.params.id;
      const result = await db.placemarkStore.updatePlacemark(placemarkId, updatedPlacemark);
      // conditional to check that we have in fact updated a placemark
      if (result) {
        const resultObject = result.toObject();
        return h.response(resultObject).code(200);
      }
      return Boom.badImplementation("Error updating placemark");

    } catch (error) {
      return Boom.badImplementation("Error updating placemark");
    }
  },
  tags: ["api"],
  description: "Update a Placemark",
  notes: "Updates an existing placemark",
  validate: {
    params: { id: IdSpec },
    payload: PlacemarkSpec
  },
  response: { emptyStatusCode: 204, failAction: validationError },
},
};
