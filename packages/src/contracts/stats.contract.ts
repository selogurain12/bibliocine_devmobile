import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { idSchema } from "../dtos/id.dto";
import { allStatSchema, statSchema, updateStatSchema } from "../dtos/stat.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const statsContract = contract.router(
  {
    simpleStats: {
      path: "",
      method: "GET",
      summary: "Get simple statistics for a user",
      description: "Get simple statistics for a user",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: statSchema,
        404: errorSchema,
      },
    },
    allStats: {
      path: "/allStats",
      method: "GET",
      summary: "Get all statistics for a user",
      description: "Get all statistics for a user",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: allStatSchema,
        404: errorSchema,
      },
    },
    updateStats: {
      path: "/:id",
      method: "PATCH",
      summary: "Update statistics for a user",
      description: "Update statistics for a user",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: updateStatSchema,
      responses: {
        200: statSchema,
        404: errorSchema,
      },
    },
  },
  { pathPrefix: "/:userId/stats" }
);
