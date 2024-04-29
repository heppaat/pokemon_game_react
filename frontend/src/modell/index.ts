import { z } from "zod";

export const LocationSchema = z.object({
  results: z
    .object({
      name: z.string(),
      url: z.string().url(),
    })
    .array(),
});

export type Location = z.infer<typeof LocationSchema>;
