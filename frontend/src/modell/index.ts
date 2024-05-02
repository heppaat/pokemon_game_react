import { z } from "zod";

export const LocationsSchema = z.object({
  results: z
    .object({
      name: z.string(),
      url: z.string().url(),
    })
    .array(),
});

export type Locations = z.infer<typeof LocationsSchema>;

export const EnemyPokemonSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export type EnemyPokemon = z.infer<typeof EnemyPokemonSchema>;

export const SingleLocationSchema = z.object({
  pokemon_encounters: z
    .object({
      pokemon: EnemyPokemonSchema,
    })
    .array(),
});

export type SingleLocation = z.infer<typeof SingleLocationSchema>;

export const MyPokemonSchema = z
  .object({
    name: z.string(),
    url: z.string().url(),
    spriteUrl: z.string().url(),
  })
  .array();

export type MyPokemons = z.infer<typeof MyPokemonSchema>;
