import Mongoose from "mongoose";

const { Schema } = Mongoose;

// define the placemark schema
const placemarkSchema = new Schema({
  title: String,
  description: String,
  location: String,
  latitude: String,
  longitude: String,
  rating: String,
  review: String,

  category: String,
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);
