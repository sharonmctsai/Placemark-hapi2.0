import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCreds, testPlacemarks, testPlacemark, testAdminCreds } from "../fixtures.js";

// setup
suite("Placemark API tests", () => {
let user = null;
let userId = null;
setup(async () => {
  placemarkService.clearAuth();
  await placemarkService.authenticate(testAdminCreds);
  await placemarkService.deleteAllPlacemarks();
  await placemarkService.deleteAllUsers();
  user = await placemarkService.createUser(maggie);
  await placemarkService.authenticate(maggieCreds);
  userId = maggie._id;
});
  teardown(async () => {
  });

  // test to create a single placemark
  test("create placemark", async () => {
    const placemark = await placemarkService.createPlacemark(testPlacemark);
    assertSubset(testPlacemark, placemark);
  });
  
  // test to retrieve a single placemark
  test("get a placemark - success", async () => {
    const placemark = await placemarkService.createPlacemark(testPlacemark);
    const returnedPlacemark = await placemarkService.getPlacemark(placemark._id);
    assert.equal(testPlacemark.description, returnedPlacemark.description);
  });

  // test to delete a placemark
  test("Delete a placemark - success", async () => {
    const placemark = await placemarkService.createPlacemark(testPlacemark);
    await placemarkService.deletePlacemark(placemark._id);
    try {
      await placemarkService.getPlacemark(placemark._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("delete all placemarks - success due to admin credentials", async () => {
    placemarkService.clearAuth();
    await placemarkService.authenticate(testAdminCreds);
    await placemarkService.createPlacemark(testPlacemark);
    await placemarkService.createPlacemark(testPlacemarks[0]);
    await placemarkService.createPlacemark(testPlacemarks[1]);
    await placemarkService.deleteAllPlacemarks();
    const placemarks = await placemarkService.getAllPlacemarks();
    assert.equal(0, placemarks.length);
  });

  test(" delete all placemarks fail - not an admin", async () => {
    try {
    await placemarkService.createPlacemark(testPlacemark);
    await placemarkService.createPlacemark(testPlacemarks[0]);
    await placemarkService.createPlacemark(testPlacemarks[1]);
    await placemarkService.deleteAllPlacemarks();
    } catch (error) {
      assert.equal(error.response.data.statusCode, 403);
    }
  });

  // test to attempt to create a placemark with invalid data
  test("create a placemark - invalid placemark", async () => {
    try {
      const newPlacemark = await placemarkService.createPlacemark("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 400);
    }
  });

  // test to attempt to retrieve a placemark with invalid data
  test("get a placemark - bad id", async () => {
    try {
      const returnedPlacemark = await placemarkService.getPlacemark("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  // test to attempt to retrieve a deleted placemark
  test("get a placemark - deleted placemark", async () => {
    const placemark = await placemarkService.createPlacemark(testPlacemark);
    await placemarkService.deletePlacemark(placemark._id);
    try {
      const returnedPlacemark = await placemarkService.getPlacemark(placemark._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
