import { z } from "zod";

export const LocationsSchema = z.object({
  results: z
    .object({
      name: z.string(),
      url: z.string().url(),
    })
    .array(),
});

export type Location = z.infer<typeof LocationsSchema>;

export const EnemyPokemonSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const SingleLocationSchema = z.object({
  pokemon_encounters: z
    .object({
      pokemon: EnemyPokemonSchema,
    })
    .array(),
});

export type SingleLocation = z.infer<typeof SingleLocationSchema>;
