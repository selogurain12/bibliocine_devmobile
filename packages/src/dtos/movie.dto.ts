import { z } from "zod";

export const movieSchema = z.object({
  id: z.string().uuid(),
  backdropPath: z.string().url().nullable(),
  genreIds: z.array(z.string()),
  originalLanguage: z.string().min(2).max(10),
  originalTitle: z.string().min(1).max(255),
  overview: z.string().min(1).max(1000),
  posterPath: z.string().url().nullable(),
  //TODO: voir si on peut pas le définir en tant que date
  releaseDate: z.string(),
  title: z.string().min(1).max(255),
  budget: z.number().min(0),
  homepage: z.string().url().nullable(),
  revenue: z.number().min(0),
  runtime: z.number().min(0).nullable(),
  voteAverage: z.number().min(0).max(10),
});

export type MovieDto = z.infer<typeof movieSchema>;
