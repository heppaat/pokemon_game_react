import { safeFetch } from "../lib/http";
import { LocationsSchema, SingleLocationSchema } from "../modell";

export const getLocations = () =>
  safeFetch({
    method: "GET",
    url: "https://pokeapi.co/api/v2/location-area",
    schema: LocationsSchema,
  });

export const getSingleLocation = (url: string) =>
  safeFetch({
    method: "GET",
    url: url,
    schema: SingleLocationSchema,
  });