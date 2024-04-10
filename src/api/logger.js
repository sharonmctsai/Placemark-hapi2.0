import Boom from "@hapi/boom";

export function validationError(request, h, error) {
  console.error("Validation error:", error.message);
  throw Boom.badRequest(error.message); 
}