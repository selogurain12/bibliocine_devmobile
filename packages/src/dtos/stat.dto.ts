import { z } from "zod";
import { userSchema } from "./user.dto";

export const createStastSchema = z.object({
  user: z.lazy(() => userSchema),
  timeSeen: z.number().min(0),
  pagesRead: z.number().min(0),
});

export const statSchema = createStastSchema.extend({
  id: z.string().uuid(),
});

export const updateStatSchema = createStastSchema.partial();

export const allStatSchema = createStastSchema
  .extend({
    id: z.string().uuid(),
    filmotheque: z.number(),
    finishedMovies: z.number(),
    moviesInProgress: z.number(),
    finishedBooks: z.number(),
    booksInProgress: z.number(),
    bibliotheque: z.number(),
  })
  .omit({ user: true });

export type StatDto = z.infer<typeof statSchema>;
export type CreateStatDto = z.infer<typeof createStastSchema>;
export type UpdateStatDto = z.infer<typeof updateStatSchema>;
export type AllStatDto = z.infer<typeof allStatSchema>;
