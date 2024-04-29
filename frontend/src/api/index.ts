import { safeFetch } from "../lib/http";
import { LocationSchema } from "../modell";

export const getLocations = () =>
  safeFetch({
    method: "GET",
    url: "https://pokeapi.co/api/v2/location",
    schema: LocationSchema,
  });
