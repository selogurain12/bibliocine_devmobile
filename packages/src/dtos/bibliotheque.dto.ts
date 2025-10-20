import { z } from "zod";
import { userSchema } from "./user.dto";

export const createBibliothequeSchema = z.object({
  name: z.string().min(1).max(100),
  book: z.array(z.string()),
});

export const bibliothequeSchema = createBibliothequeSchema.extend({
  id: z.string().uuid(),
  user: z.lazy(() => userSchema).array(),
});

export const updateBibliothequeSchema = createBibliothequeSchema.partial();

export type BibliothequeDto = z.infer<typeof bibliothequeSchema>;
export type CreateBibliothequeDto = z.infer<typeof createBibliothequeSchema>;
export type UpdateBibliothequeDto = z.infer<typeof updateBibliothequeSchema>;
