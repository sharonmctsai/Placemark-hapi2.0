import Joi from "joi";

// joi schemas for the user objects as per labs
export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("User Credentials");

export const UserSpec = UserCredsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("User");

export const UserUpdateSpec = Joi.object()
  .keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
    email: Joi.string().email().example("homer@simpsons.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("User Update");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("Full User Details");

export const UserArray = Joi.array().items(UserSpecPlus).label("User Array");

// array of allowed placemarks for user in the placemarks schema
const allowedCategories = ["Landmark", "Beach", "River", "Lake"];

// spread operator is used to spread the allowedCategories array into the valid() function ensuring user has to use one of the allowed categories
export const PlacemarkSpec = Joi.object()
  .keys({
    title: Joi.string().example(" The Spire").required(),
    description: Joi.string().example("Beautiful Landmark in the city").max(200).required(),
    location: Joi.string().example("Dublin, Ireland").required(),
    latitude: Joi.number().example("53.3498").min(-90).max(90).required(),
    longitude: Joi.number().example("-6.2603").required(),
    rating: Joi.string(),
    review: Joi.string(),

    category: Joi.string()
      .example("Landmark")
      .valid(...allowedCategories)
      .required(),
    img: Joi.string().example("spire.jpg")
  })
  .label("Placemark Details");

export const PlacemarkPlusSpec = PlacemarkSpec.keys({
  userId: IdSpec,
  _id: IdSpec,
  __v: Joi.number(),
}).label("Expanded Placemark Details");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkPlusSpec).label("Placemark Array");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9").required(),
  })
  .label("Jwt Authentification");
  
