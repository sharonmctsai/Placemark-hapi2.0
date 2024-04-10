import { JSONFilePreset } from "lowdb/node";

// Create a JSON file preset
export const db = await JSONFilePreset("src/models/json/db.json", {
  users: [],
  placemarks: [],
});