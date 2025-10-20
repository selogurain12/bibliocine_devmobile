import { z } from "zod";
import { userSchema } from "./user.dto";

export const createBookInProgressSchema = z.object({
  bookId: z.string().uuid(),
  currentPage: z.number().min(0),
});

export const bookInProgressSchema = createBookInProgressSchema.extend({
  id: z.string().uuid(),
  user: z.lazy(() => userSchema),
});

export const updateBookInProgressSchema = createBookInProgressSchema.partial();

export type BookInProgressDto = z.infer<typeof bookInProgressSchema>;
export type CreateBookInProgressDto = z.infer<typeof createBookInProgressSchema>;
export type UpdateBookInProgressDto = z.infer<typeof updateBookInProgressSchema>;
