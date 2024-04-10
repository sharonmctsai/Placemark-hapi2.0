import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, testPlacemark, maggie, testPlacemarkImages } from "../fixtures.js";

// setup
suite("Placemark Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.placemarkStore.deleteAllPlacemarks();
    await db.userStore.deleteAll();
  });

  // test to create a single placemark
  test("create single placemark", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    assert.isNotNull(placemark._id);
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, 1);
  });

  // test to create multiple placemarks
  test("create multiple placemarks", async () => {
    const user = await db.userStore.addUser(maggie);
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlacemarks[i] = await db.placemarkStore.addPlacemark(user._id, testPlacemarks[i]);
    }
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, testPlacemarks.length + 10);
  });

  // test to successfully get a placemark
  test("get a placemark - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemarkToAdd = testPlacemark;
    const addedPlacemark = await db.placemarkStore.addPlacemark(user._id, placemarkToAdd);
    const retrievedPlacemark = await db.placemarkStore.getPlacemarkById(addedPlacemark._id);
    assert.equal(retrievedPlacemark.title, placemarkToAdd.title);
  });
  
  // test to update a placemark
  test("updated a placemark - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    console.log(placemark);
    const update = {
      title: "River Lee",
      description: "River running through Cork city in munster province of Ireland",
      location: "Cork City, Ireland",
      latitude: "53.381290",
      longitude: "-6.591850",
      category: "River",
    };
    const updatedPlacemark = await db.placemarkStore.updatePlacemark(placemark._id, update);
    console.log(updatedPlacemark);
    assert.notEqual(placemark.description, updatedPlacemark.description);
  });

  // test to add an image to a placemark
  test("add image to placemark - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    const imageFile = testPlacemarkImages[0];
    await db.placemarkStore.updatePlacemarkImage(placemark._id, imageFile);
    const updatedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assert.isNotNull(updatedPlacemark.img); 
  });

  // test to delete an image from a placemark
  test("delete image from placemark - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    const imageFile = testPlacemarkImages[0];
    await db.placemarkStore.updatePlacemarkImage(placemark._id, imageFile);
    let updatedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assert.isNotNull(updatedPlacemark.img);
    await db.placemarkStore.updatePlacemarkImage(placemark._id, null);
    updatedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assert.equal(updatedPlacemark.img, null);
  });
  
  // test to get all placemarks based on a users id
  test("get placemarks by user id", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    const placemarks = await db.placemarkStore.getPlacemarksByUserId(user._id);
    assert.equal(1, placemarks.length);
  });

  // test to successfully delete a single placemark
  test("delete One Placemark - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    await db.placemarkStore.deletePlacemark(placemark._id);
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(0, placemarks.length);
  });

  // test to delete all placemarks
  test("delete all placemarks", async () => {
    const user = await db.userStore.addUser(maggie);
    await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    await db.placemarkStore.deleteAllPlacemarks();
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(0, placemarks.length);
  });

  // test to unsuccessfully get a placemark
  test("get a placemark - bad params", async () => {
    assert.isTrue(await db.placemarkStore.getPlacemarkById("") === null || await db.placemarkStore.getPlacemarkById("") === undefined);
    assert.isTrue(await db.placemarkStore.getPlacemarkById() === null || await db.placemarkStore.getPlacemarkById() === undefined);
  });

  // test to unsuccessfully delete a placemark by passing in a bad id
  test("delete one placemark - fail", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    await db.placemarkStore.deletePlacemark("1551");
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(1, placemarks.length);
  });
});