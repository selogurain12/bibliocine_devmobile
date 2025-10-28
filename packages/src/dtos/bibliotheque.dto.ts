import { z } from "zod";
import { userSchema } from "./user.dto";

export const createBibliothequeSchema = z.object({
  name: z.string().min(1).max(100),
  books: z.array(z.string()).optional(),
});

export const bibliothequeSchema = createBibliothequeSchema.extend({
  id: z.string().uuid(),
  users: z.lazy(() => userSchema).array(),
});

export const updateBibliothequeSchema = bibliothequeSchema.partial();

export type BibliothequeDto = z.infer<typeof bibliothequeSchema>;
export type CreateBibliothequeDto = z.infer<typeof createBibliothequeSchema>;
export type UpdateBibliothequeDto = z.infer<typeof updateBibliothequeSchema>;
