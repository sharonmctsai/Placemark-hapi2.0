import { userMongoStore } from "./mongo/user-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userJsonStore } from "./json/user-json-store.js";
import { placemarkJsonStore } from "./json/placemark-json-store.js";

// export db object
export const db = {
  userStore: null,
  categoryStore: null,
  placemarkStore: null,

  // function to initialize the store (json or mongo depending on case dictated by init function in server.js)
  init(storeType) {
    switch (storeType) {
      case "json":
        this.userStore = userJsonStore;
        this.placemarkStore = placemarkJsonStore;
        break;
      case "mongo":
        this.userStore = userMongoStore;
        this.placemarkStore = placemarkMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMongoStore;
        this.placemarkStore = placemarkMongoStore;
    }
  },
};
