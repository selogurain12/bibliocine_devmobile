import { z } from "zod";
import { userSchema } from "./user.dto";

export const createMovieInProgressSchema = z.object({
  movieId: z.string().uuid(),
  viewingTime: z.number().min(0),
});

export const movieInProgressSchema = createMovieInProgressSchema.extend({
  id: z.string().uuid(),
  user: z.lazy(() => userSchema),
});

export const updateMovieInProgressSchema = createMovieInProgressSchema.partial();

export type MovieInProgressDto = z.infer<typeof movieInProgressSchema>;
export type CreateMovieInProgressDto = z.infer<typeof createMovieInProgressSchema>;
export type UpdateMovieInProgressDto = z.infer<typeof updateMovieInProgressSchema>;
