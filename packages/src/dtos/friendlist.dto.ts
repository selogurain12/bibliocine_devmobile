import { z } from "zod";
import { userSchema } from "./user.dto";

export const createFriendlistSchema = z.object({
  user: z.lazy(() => userSchema),
  friends: z.array(z.lazy(() => userSchema)),
});

export const friendlistSchema = createFriendlistSchema.extend({
  id: z.string().uuid(),
});

export const updateFriendlistSchema = createFriendlistSchema.partial();

export type FriendlistDto = z.infer<typeof friendlistSchema>;
export type CreateFriendlistDto = z.infer<typeof createFriendlistSchema>;
export type UpdateFriendlistDto = z.infer<typeof updateFriendlistSchema>;
