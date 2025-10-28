/* eslint-disable camelcase */
import { z } from "zod";

export const movieSchema = z.object({
  id: z.number(),
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

export const returnApiGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const returnApiMovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  belongs_to_collection: z.string().nullable(),
  budget: z.number(),
  genres: z.array(z.lazy(() => returnApiGenreSchema)),
  homepage: z.string(),
  id: z.number(),
  imdb_id: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string(),
      name: z.string(),
      origin_country: z.string(),
    })
  ),
  production_countries: z.array(
    z.object({
      iso_3166_1: z.string(),
      name: z.string(),
    })
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(
    z.object({
      englishName: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    })
  ),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const returnApiSearchMovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export type MovieDto = z.infer<typeof movieSchema>;
export type ReturnApiGenreDto = z.infer<typeof returnApiGenreSchema>;
export type ReturnApiMovieDto = z.infer<typeof returnApiMovieSchema>;
export type ReturnApiSearchMovieDto = z.infer<typeof returnApiSearchMovieSchema>;
