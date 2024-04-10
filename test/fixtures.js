import dotenv from "dotenv";

dotenv.config();

export const serviceUrl = "http://localhost:3000";

export const maggie = {
  firstName: "Maggie",
  lastName: "Simpson",
  email: "maggie@simpson.com",
  password: "secret"
};

export const maggieCreds = {
  email: "maggie@simpson.com",
  password: "secret"
};

export const testAdminCreds = {
  email : process.env.email,
  password : process.env.password
}

export const testUsers = [
  {
    firstName: "Homer",
    lastName: "Simpson",
    email: "homer@simpson.com",
    password: "secret"
  },
  {
    firstName: "Marge",
    lastName: "Simpson",
    email: "marge@simpson.com",
    password: "secret"
  },
  {
    firstName: "Bart",
    lastName: "Simpson",
    email: "bart@simpson.com",
    password: "secret"
  }
];

export const testPlacemark = {
  "title" : "The Spire",
  "description" : "Shining niddle in the city",
  "location" : "Dublin, Ireland",
  "latitude" : "53.3498",
  "longitude" : "-6.2603",
  "category" : "Landmark",
};

export const incorrectPlaceMark = {
  "title" : "",
  "description" : "test",
  "location" : "test",
  "latitude" : "test",
  "longitude" : "test",
  "category" : "test",
};

export const testPlacemarks = [
  {
    "title" : "The Spire",
    "description" : "Shining niddle in the city",
    "location" : "Dublin, Ireland",
    "latitude" : "53.3498",
    "longitude" : "-6.2603",
    "category" : "Landmark"
  },
  {
    "title" : "Eiffel Tower",
    "description" : "Wrought-iron lattice tower.",
    "location" : "Paris, France",
    "latitude" : "48.8584",
    "longitude" : "2.2945",
    "category" : "Landmark"
  },
  {
    "title" : "Crosshaven Beach",
    "description" : "A major sailing and angling centre",
    "location" : "Cork,Ireland",
    "latitude" : " 51.4807",
    "longitude" : "-0.8174",
    "category" : "Beach"
  },
  {
    "title" : "River Nile",
    "description" : " North-flowing river in northeastern Africa",
    "location" : "Sudan,Egypt",
    "latitude" : "29.533438",
    "longitude" : "31.270695",
    "category" : "River"
  },
  {
    "title" : "Lake Louise",
    "description" : " is a hamlet in Banff National Park in the Canadian Rockies, known for its turquoise.",
    "location" : "Alberta, Canada",
    "latitude" : "51.4254",
    "longitude" : "-116.1773",
    "category" : "Lake"
  }
];

const spireImage = "http://res.cloudinary.com/da8fwqar1/image/upload/v1712511274/iczhnbejbq9unxq38ibr.jpg";
const riverImage = "http://res.cloudinary.com/da8fwqar1/image/upload/v1712511284/xq8nybh2xtbh1cgsjpdc.jpg";
const lakeImage = "http://res.cloudinary.com/da8fwqar1/image/upload/v1712511294/abf0w8ddkbvksblzxu9a.webp";
const beachImage = "http://res.cloudinary.com/da8fwqar1/image/upload/v1712511116/eo56ngncunp8dzuik5ij.jpg";
const towerImage = "http://res.cloudinary.com/da8fwqar1/image/upload/v1712511089/fgpce9sp5ckkuzo8qama.avif";

export const testPlacemarkImages = [ spireImage, riverImage, lakeImage, beachImage, towerImage ]


