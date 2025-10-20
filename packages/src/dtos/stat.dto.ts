import { z } from "zod";
import { userSchema } from "./user.dto";

export const createStastSchema = z.object({
  user: z.lazy(() => userSchema),
  timeSeen: z.number().min(0),
  pageRead: z.number().min(0),
});

export const statSchema = createStastSchema.extend({
  id: z.string().uuid(),
});

export const updateStatSchema = createStastSchema.partial();

export type StatDto = z.infer<typeof statSchema>;
export type CreateStatDto = z.infer<typeof createStastSchema>;
export type UpdateStatDto = z.infer<typeof updateStatSchema>;
