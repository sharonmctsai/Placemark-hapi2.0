import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { UserSpec, UserSpecPlus, IdSpec, UserArray, JwtAuth, UserCredsSpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { createToken, validate, decodeToken } from "./jwt-utils.js";

export const userApi = {
  // function to find all users
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const decodedToken = decodeToken(request.headers.authorization);
      if (decodedToken.role !== "admin") {
        return Boom.forbidden("Only admins can view all users");
      }
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Returns details of all users",
    response: { schema: UserArray, failAction: validationError },
  },

  // function to find a single user by id
  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  // function to create a new user
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  // function to update a user
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
        // eslint-disable-next-line prefer-destructuring
        const userId = decodedToken.userId;
        // declare the updated user as the payload
        const updatedUser = request.payload;
        // passing the updated user to the updateUser function
        const result = await db.userStore.updateUser(userId, updatedUser);
        // convert the result to an object
        const resultObject = result.toObject();
        // return the updated user
        return h.response(resultObject).code(200);

      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Update a user",
    notes: "Returns the updated user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },
      
  // function to delete all users
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const decodedToken = decodeToken(request.headers.authorization);
      // check the role of the user and throw error if they are not an admin
      if (decodedToken.role !== "admin") {
        return Boom.forbidden("Only admins can delete all users");
      }
      try {
        await db.placemarkStore.deleteAllPlacemarks();
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "All users removed from Playtime",
  },

  // function to delete a single user by id
  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userId = request.params.id;
      const decodedToken = decodeToken(request.headers.authorization);
      // check the role of the user and throw error if they are not an admin
      if (decodedToken.role !== "admin") {
        return Boom.forbidden("Only admins can delete users");
      }
      try {
        await db.userStore.deleteUserById(userId);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a single user",
    notes: "Deletes a single user from Playtime by their ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  // function to authenticate a user and create a JWT token upon success
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const { email, password } = request.payload;
        // Check if email and password are provided
        if (!email || !password) {
          return Boom.badRequest("Email and password are required");
        }
        if (email === process.env.email && password === process.env.password) {
          const admin = {
            email: process.env.email,
            password: process.env.password,
          };
          const token = createToken(admin);
          return h.response({ success: true, token: token }).code(201);
          }
        // Authenticate user based on email and password
        const user = await db.userStore.getUserByEmail(email);
        if (!user || user.password !== password) {
          return Boom.unauthorized("Invalid email or password");
        }
        // Generate JWT token for authenticated user
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Authenticate a User",
    notes: "If user has valid email/password, create and return a JWT token",
    validate: { payload: UserCredsSpec, failAction: validationError },
    response: { schema: JwtAuth, failAction: validationError },
  },
};