import * as dotenv from "dotenv";
import Mongoose from "mongoose";
import * as mongooseSeeder from "mais-mongoose-seeder";
import { seedData } from "./seed-data.js";

const seedLib = mongooseSeeder.default;

// seeding function
async function seed() {
  const seeder = seedLib(Mongoose);
  const dbData = await seeder.seed(seedData, { dropDatabase: false, dropCollections: true });
  console.log("Database is empty. Seeding data...");
  console.log("Seeded data: ");
  console.log(dbData);
}

// connect to the MongoDB database
export function connectMongo() {
  dotenv.config();

  Mongoose.set("strictQuery", true);
  Mongoose.connect(process.env.db);
  const db = Mongoose.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  db.once("open", async function () {
    console.log(`database connected to ${this.name} on ${this.host}`);
    const User = Mongoose.model("User");
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      seed();
    }
  });
}
