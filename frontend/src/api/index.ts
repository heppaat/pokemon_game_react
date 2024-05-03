import { safeFetch } from "../lib/http";
import {
  LocationsSchema,
  SingleLocationSchema,
  MyPokemonSchema,
  StatsSchema,
} from "../modell";

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

export const getImageOfEnemyPokemon = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const getMyPokemons = () =>
  safeFetch({
    method: "GET",
    url: "http://localhost:3002/api/myPokemons",
    schema: MyPokemonSchema.array(),
  });

export const getStats = (url: string) =>
  safeFetch({
    method: "GET",
    url: url,
    schema: StatsSchema,
  });
