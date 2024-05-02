import { z } from "zod";

export const MyPokemonSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  spriteUrl: z.string().url(),
});
