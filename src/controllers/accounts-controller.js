import dotenv from "dotenv";
import { db } from "../models/db.js";
// eslint-disable-next-line import/no-duplicates
import { UserSpec, UserUpdateSpec } from "../models/joi-schemas.js";
// eslint-disable-next-line import/no-duplicates
import { UserCredsSpec } from "../models/joi-schemas.js";

dotenv.config();

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/login");
    },
  },

  // shows login page
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemark" });
    },
  },

  // function to log in a user, payload is checked against UserCredsSpec schema
  login: {
    auth: false,
    validate: {
      payload: UserCredsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;

      if (email === process.env.email && password === process.env.password) {
        request.cookieAuth.set({ id: "admin" });
        console.log(`logging in: ${process.env.email}`);
        return h.redirect("/admin");
      }
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      console.log(`logging in: ${user.email}`);
      return h.redirect("/dashboard");
    },
  },

  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  updateUser: {
    auth: false,
    validate: {
      payload: UserUpdateSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("profile-view", { title: "Update error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const updatedUser = request.payload;
      const userId = request.params.id;
      await db.userStore.updateUser(userId, updatedUser); 
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    if (session.id === "admin") {
      return { isValid: true, credentials: { id: "admin" } };
    }
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
