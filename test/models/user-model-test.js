import { assert } from "chai";
import mongoose from "mongoose";
import { db } from "../../src/models/db.js";
import { maggie, testUsers, testPlacemarks } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

// test setup
suite("User Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  // test to create a new user
  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser);
  });

  // test to delete all placemarks
  test("delete all placemarks", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  // test to get a user by both id and email
  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
  });

  // test to delete a user and their placemarks
  test("delete a user and their placemarks", async () => {
    // add a user with some placemarks
    const user = await db.userStore.addUser(maggie);
    await db.placemarkStore.addPlacemark(user._id, testPlacemarks[0]);
    await db.placemarkStore.addPlacemark(user._id, testPlacemarks[1]);
    await db.userStore.deleteUserById(user._id);

    // verify that the user is deleted
    const deletedUser = await db.userStore.getUserById(user._id);
    assert.isNull(deletedUser);

    // verify that the user's placemarks are deleted
    const userPlacemarks = await db.placemarkStore.getPlacemarksByUserId(user._id);
    assert.isEmpty(userPlacemarks);
  });


  // test to update a users details
  test("update a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const update = {
      firstName: "Little Maggie",
      lastName: "Simpson",
      email: "maggie@simpson.com",
      password: "secret",
    };
    const updatedUser = await db.userStore.updateUser(user._id, update);
    assert.notEqual(user.firstName, updatedUser.firstName);
  });


  // test to successfully delete a user
  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });


  // test to check for a user using bad params
  test("get a user - bad params", async () => {
    assert.isNull(await db.userStore.getUserByEmail(""));
    assert.isNull(await db.userStore.getUserById(""));
    assert.isNull(await db.userStore.getUserById());
  });


  // test to unsuccessfully delete a user
  test("delete One User - fail", async () => {
    const newUser = await db.userStore.addUser(maggie);
    const userId = newUser._id;
    await db.userStore.deleteUserById(userId);
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(allUsers.length, testUsers.length);
});
});