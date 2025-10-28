import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { filterSchema } from "../dtos/filter.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { updateUserSchema, userSchema } from "../dtos/user.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const userContract = contract.router({
  getAll: {
    path: "/",
    method: "GET",
    summary: "Get all users",
    description: "Get all users",
    query: filterSchema,
    responses: {
      200: ListResultSchema(userSchema),
      404: errorSchema,
    },
  },
  get: {
    path: "/:username",
    method: "GET",
    summary: "Get user with his username",
    description: "Get user with his username",
    pathParams: z.object({
      username: z.string(),
    }),
    responses: {
      200: userSchema,
      404: errorSchema,
    },
  },
  update: {
    path: "/:userId",
    method: "PATCH",
    summary: "Update a user by its ID",
    description: "Update a user by its ID",
    pathParams: z.object({
      userId: z.string().uuid(),
    }),
    body: updateUserSchema,
    responses: {
      200: userSchema,
      404: errorSchema,
    },
  },
});
