import { initContract } from "@ts-rest/core";
import { neverDtoSchema } from "dtos/delete-request.dto";
import { friendlistSchema, updateFriendlistSchema } from "dtos/friendlist.dto";
import { ListResultSchema } from "dtos/list-result.dto";
import { errorSchema } from "errors";
import { z } from "zod";

const contract = initContract();
export const friendlistContract = contract.router(
  {
    getAllFriendlist: {
      path: "",
      method: "GET",
      summary: "Get all of the friend list of a user",
      description: "Get all of the friend list of a user",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(friendlistSchema),
        404: errorSchema,
      },
    },
    updateFriendlist: {
      path: "",
      method: "PATCH",
      summary: "Update the friend list of a user",
      description: "Update the friend list of a user",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      body: updateFriendlistSchema,
      responses: {
        200: ListResultSchema(friendlistSchema),
        404: errorSchema,
      },
    },
    deleteFriendlist: {
      path: "",
      method: "DELETE",
      summary: "Delete friend from friend list of a user",
      description: "Delete friend from friend list of a user",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      body: neverDtoSchema,
      responses: {
        204: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/friendlist",
  }
);
