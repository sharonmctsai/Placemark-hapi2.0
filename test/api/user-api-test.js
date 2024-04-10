import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCreds, testUsers, testAdminCreds, testPlacemark } from "../fixtures.js";
import { db } from "../../src/models/db.js";

const users = new Array(testUsers.length);
let maggieUser = "";

// setup
suite("User API tests", () => {
  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.authenticate(testAdminCreds);
    await placemarkService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[0] = await placemarkService.createUser(testUsers[i]);
    }
    maggieUser = await placemarkService.createUser(maggie);
  });
  teardown(async () => {});

  // test to create a user
  test("create a user", async () => {
    await placemarkService.authenticate(maggieCreds);
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  // test to delete all users
  test("delete all users - success due to admin credentials", async () => {
    placemarkService.clearAuth();
    await placemarkService.authenticate(testAdminCreds);
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCreds);
    await placemarkService.createPlacemark(testPlacemark);
    await placemarkService.authenticate(testAdminCreds);
    await placemarkService.deleteAllUsers();
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
    // added to check that user deletion prompted placemark deletion
    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  // test to delete all users - should fail due to user vs admin creds
  test("delete all users - fail due to not being an admin", async () => {
    try {
      await placemarkService.deleteAllUsers();
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
    }
  });

  // test to delete a single user
  test("delete a user", async () => {
    await placemarkService.authenticate(testAdminCreds);
    console.log(testAdminCreds);
    console.log(maggieUser._id);
    await placemarkService.deleteUser(maggieUser._id);
    assert.deepEqual(users.length, 3);
  });

  // test to delete a single user - should fail due to user vs admin creds
  test("delete a user - fail due to not being an admin", async () => {
    try {
      await placemarkService.authenticate(maggieCreds);
      await placemarkService.deleteUser(maggie._id);
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
    }
  });

  // test to get a user by id
  test("get a user", async () => {
    const returnedUser = await placemarkService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  // test to attempt to retrieve a user with invalid data
  test("get a user - bad id", async () => {
    try {
      const returnedUser = await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  // test to attempt to retrieve a user that has been deleted
  test("get a user - deleted user", async () => {
    placemarkService.clearAuth();
    await placemarkService.authenticate(testAdminCreds);
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCreds);
    try {
      const returnedUser = await placemarkService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});