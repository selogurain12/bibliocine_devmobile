import { z } from "zod";
import { userSchema } from "./user.dto";

export const createFinishedMovieSchema = z.object({
  movieId: z.string().uuid(),
});

export const finishedMovieSchema = createFinishedMovieSchema.extend({
  id: z.string().uuid(),
  user: z.lazy(() => userSchema),
});

export type FinishedMovieDto = z.infer<typeof finishedMovieSchema>;
export type CreateFinishedMovieDto = z.infer<typeof createFinishedMovieSchema>;
