import { z } from "zod";
import { userSchema } from "./user.dto";

export const createFilmothequeSchema = z.object({
  name: z.string().min(1).max(100),
  movies: z.array(z.string()).optional(),
});

export const filmothequeSchema = createFilmothequeSchema.extend({
  id: z.string().uuid(),
  users: z.lazy(() => userSchema).array(),
});

export const updateFilmothequeSchema = filmothequeSchema.partial();

export type FilmothequeDto = z.infer<typeof filmothequeSchema>;
export type CreateFilmothequeDto = z.infer<typeof createFilmothequeSchema>;
export type UpdateFilmothequeDto = z.infer<typeof updateFilmothequeSchema>;
