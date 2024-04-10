/* eslint-disable no-restricted-syntax */
/* eslint-disable arrow-body-style */
import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { placemarkJsonStore } from "./placemark-json-store.js";

// export userJsonStore object
export const userJsonStore = {
  async getAllUsers() {
    await db.read();
    return db.data.users;
  },

  // function to add a user
  async addUser(user) {
    await db.read();
    user._id = v4();
    db.data.users.push(user);
    await db.write();
    return user;
  },

  // function to get user by id
  async getUserById(id) {
    await db.read();
    let u = db.data.users.find((user) => user._id === id);
    if (u === undefined) u = null;
    return u;
  },

  // function to get user by email
  async getUserByEmail(email) {
    await db.read();
    let u = db.data.users.find((user) => user.email === email);
    if (u === undefined) u = null;
    return u;
  },

  // function to update a user
  async updateUser(userId, updatedUser) {
    await db.read();
    // eslint-disable-next-line no-shadow
    const user = db.data.users.find((user) => user._id === userId);
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    user.email = updatedUser.email;
    user.password = updatedUser.password;
    await db.write();
    return user;
  },

  // function to delete a user by id
  async deleteUserById(id) {
    await db.read();
    const userIndex = db.data.users.findIndex((user) => user._id === id);
    if (userIndex !== -1) {
      const userPlacemarks = await placemarkJsonStore.getPlacemarksByUserId(id);
      // unfortunately looping through the placemarks and deleting them one by one was the only way I could get this to work with testing
      for (const placemark of userPlacemarks) {
        // eslint-disable-next-line no-await-in-loop
        await placemarkJsonStore.deletePlacemark(placemark._id);
      }
      db.data.users.splice(userIndex, 1);
      await db.write();
    }
  },

  // function to delete all users
  async deleteAll() {
    db.data.users = [];
    await db.write();
  },
};
