import { safeFetch } from "../lib/http";
import { z } from "zod";
import {
  LocationsSchema,
  SingleLocationSchema,
  MyPokemonSchema,
  StatsSchema,
  MyPokemon,
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

export const addWonPokemon = (enemyPokemon: MyPokemon) =>
  safeFetch({
    method: "POST",
    url: "http://localhost:3002/api/myPokemons/data",
    schema: z.object({ success: z.boolean() }),
    payload: enemyPokemon,
  });
