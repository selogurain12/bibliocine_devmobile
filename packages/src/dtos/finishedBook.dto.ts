import { z } from "zod";
import { userSchema } from "./user.dto";

export const createFinishedBookSchema = z.object({
  bookId: z.string().uuid(),
});

export const finishedBookSchema = createFinishedBookSchema.extend({
  id: z.string().uuid(),
  user: z.lazy(() => userSchema),
});

export type FinishedBookDto = z.infer<typeof finishedBookSchema>;
export type CreateFinishedBookDto = z.infer<typeof createFinishedBookSchema>;
