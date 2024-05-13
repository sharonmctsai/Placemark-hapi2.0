import { User } from "./user.js";
import { placemarkMongoStore } from "./placemark-mongo-store.js";
let favoritePlacemarks = [];

// export userMongoStore object
export const userMongoStore = {
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },

  // function to get user by id
  async getUserById(id) {
    if (id) {
      const user = await User.findOne({ _id: id }).lean();
      return user;
    }
    return null;
  },

  // function to add a user
  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },

  // function to get user by email
  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
  },

  // function to delete a user by id
  async deleteUserById(id) {
    // retrieving the user's placemarks
    const userPlacemarks = await placemarkMongoStore.getPlacemarksByUserId(id);
    // creating an array of promises to delete each placemark from the userPlaceMarks array
    await Promise.all(
      userPlacemarks.map(async (placemark) => {
        await placemarkMongoStore.deletePlacemark(placemark._id);
      })
    );
    // deleting the user
    await User.deleteOne({ _id: id });
  },

  // function to get the number of placemarks for a user
  async getNumberOfPlacemarks(id) {
    const user = await this.getUserById(id);
    return user.placemarks.length;
  },

  // function to delete all users
  async deleteAll() {
    await User.deleteMany({});
  },

  // function to update a user
  async updateUser(userId, updatedUser) {
    const currentUser = await User.findOne({ _id: userId });
    currentUser.firstName = updatedUser.firstName;
    currentUser.lastName = updatedUser.lastName;
    currentUser.email = updatedUser.email;
    currentUser.password = updatedUser.password;
    const updatedUserObject = await currentUser.save();
    return updatedUserObject;
  },

// user-store.js

async addFavoritePlacemark(userId, placemarkId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.favoritePlacemarks.push(placemarkId);
  await user.save();
},

// Function to get all favorite placemarks for a user
async getFavoritePlacemarks(userId) {
  const user = await User.findById(userId).populate("favoritePlacemarks");
  if (!user) {
    throw new Error("User not found");
  }

  return user.favoritePlacemarks;
},

// Function to remove a favorite placemark for a user
async removeFavoritePlacemark(userId, placemarkId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.favoritePlacemarks = user.favoritePlacemarks.filter(
    (favId) => favId.toString() !== placemarkId
  );
  await user.save();
},
};