import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, maggieCreds, testAdminCreds } from "../fixtures.js";

// setup
suite("Authentication API tests", async () => {
  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.authenticate(testAdminCreds);
    await placemarkService.deleteAllUsers();
  });

  // test to create a user and authenticate the user by checking for a token
  test("authenticate", async () => {
    const returnedUser = await placemarkService.createUser(maggie);
    const response = await placemarkService.authenticate(maggieCreds);
    assert(response.success);
    assert.isDefined(response.token);
  });

  // test to verify a token by decoding it and matching the user details
  test("verify Token", async () => {
    const returnedUser = await placemarkService.createUser(maggie);
    const response = await placemarkService.authenticate(maggieCreds);
    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  // test to check for an unauthorized route by clearing authorization and then attempting to delete all users
  test("check Unauthorized", async () => {
    placemarkService.clearAuth();
    try {
      await placemarkService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});